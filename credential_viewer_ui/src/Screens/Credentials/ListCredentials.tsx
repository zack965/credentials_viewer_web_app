import { ChangeEvent, useEffect, useState } from "react";
import {
  Alert,
  Button,
  IconButton,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  /*  Spinner, */
} from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons/faEyeSlash";
import { faCopy } from "@fortawesome/free-solid-svg-icons/faCopy";
import copy from "copy-to-clipboard";
import { IAlertData } from "../../AppInterfaces/IAlertData";
import { Category } from "../../Types/Category";
import { ZodError, z } from "zod";
import { ApiClient } from "../../API/ApiClient";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ErrorObject, ErrorsByKey } from "../../Types/types";
import { AxiosError } from "axios";

function ListCredentials() {
  // const [UserCredentials, setUserCredentials] = useState<Category[]>([]);
  const [AlertData, setAlertData] = useState<IAlertData | null>(null);
  const [VisibleSecretValues, setVisibleSecretValues] = useState<number[]>([]);
  const [decrypted_values_list, setdecrypted_values_list] = useState<
    Record<string, string>
  >({});
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const [openCreateCredentialsAsFile, setOpenCreateCredentialsAsFile] = useState(false);
  const handleOpenCreateCredentialsAsFile = () => setOpenCreateCredentialsAsFile((cur) => !cur);
  const [Errors, setErrors] = useState<ErrorsByKey>();
  const [CategoryName, setCategoryName] = useState("");
  const [CategoryDesc, setCategoryDesc] = useState("");
  const queryClient = useQueryClient();
  // credentials logic 
  const [openCreateCredential, setOpenCreateCredential] = useState(false);
  const handleOpenCreateCredential = () => setOpenCreateCredential((cur) => !cur);
  const [credential_key, setcredential_key] = useState("");
  const [credential_value, setcredential_value] = useState("");
  const [credential_value_as_file, setcredential_value_as_file] = useState<File>();
  const DonwnloadFile = (file_path: string) => {
    const data = new FormData();
    data.append('file_path', file_path);



    ApiClient.post("/credential/GetFileFromStoragePath", data, {
      headers: {
        'Accept': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("credential_access_token")}`,
      },
      responseType: 'blob'
    })
      .then((response) => {
        // console.log(JSON.stringify(response.data));

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file_path); //or any other extension
        document.body.appendChild(link);
        link.click();
      })
      .catch((error: AxiosError) => {
        if (error.response?.status == 422) {

          setAlertData({
            color: "bg-red-500",
            text: "file not found",
          });
        }
      });
  }
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    //  setcredential_value_as_file(event.target.files[0]);
    if (event.target.files && event.target.files.length > 0) {
      /* const file = event.target.files[0];
      setcredential_value_as_file(file); */
      const { files } = event.target;
      const selectedFiles = files as FileList;
      setcredential_value_as_file(selectedFiles?.[0]);
    }
  };
  const [ErrorsCreateCredentials, setErrorsCreateCredentials] = useState<ErrorsByKey>()
  const [ErrorsCreateCredentialsAsFile, setErrorsCreateCredentialsAsFile] = useState<ErrorsByKey>()
  const SaveCredentialsAsFile = (category_id: number) => {
    const credentials_schema = z.object({
      credential_key: z.string().min(2, { message: "key must have more then 2 charachters" })
    });
    try {
      const data = credentials_schema.parse({
        credential_key: credential_key
      })
      console.log(data)

      setErrorsCreateCredentialsAsFile(undefined)
      const formData = new FormData();
      formData.append("credential_key", credential_key);
      if (credential_value_as_file) {
        console.log("credential_value_as_file" + credential_value_as_file.name)
        formData.append("credential_value_file", credential_value_as_file);
      }
      formData.append("categorie_id", category_id.toString());
      /* const api_data = JSON.stringify({
        "credential_key": credential_key,
        "credential_value": credential_value,
        "categorie_id": category_id
      }); */

      ApiClient.post("/credential/create_credential_as_file", formData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("credential_access_token")}`,
          "Content-Type": "multipart/form-data",
        }
      })
        .then(() => {
          queryClient.invalidateQueries("fetchCredentials")

          /*  fetchCredentials() */
          setOpenCreateCredentialsAsFile((cur) => !cur)
          setAlertData({
            color: "bg-teal-400",
            text: "category as file has been added to this category successfully"
          })
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      if (error instanceof ZodError) {
        const errorsByKey: ErrorsByKey = {};

        for (const issue of (error as ErrorObject).issues) {
          const key = issue.path[0];
          if (!errorsByKey[key]) {
            errorsByKey[key] = [];
          }

          errorsByKey[key]!.push(issue.message);
        }
        setErrorsCreateCredentialsAsFile(errorsByKey)
        console.error('Errors by key:', errorsByKey);
      } else {
        console.error('Unknown error:', error);
      }
    }
  }
  const SaveCredentials = (category_id: number) => {
    const credentials_schema = z.object({
      credential_key: z.string().min(2, { message: "key must have more then 2 charachters" }),
      credential_value: z.string().min(1, { message: "key must have more then 1 charachter" }),
    });
    try {
      const data = credentials_schema.parse({
        credential_key: credential_key,
        credential_value: credential_value,
      })
      console.log(data)
      setErrorsCreateCredentials(undefined)
      console.log(category_id)
      const api_data = JSON.stringify({
        "credential_key": credential_key,
        "credential_value": credential_value,
        "categorie_id": category_id
      });

      ApiClient.post("/credential/create_credential", api_data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem("credential_access_token")}`
        }
      })
        .then((response) => {
          queryClient.invalidateQueries("fetchCredentials")

          /*  fetchCredentials() */
          setOpenCreateCredential((cur) => !cur)
          setAlertData({
            color: "bg-teal-400",
            text: "category has been added to this category successfully"
          })
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      if (error instanceof ZodError) {
        const errorsByKey: ErrorsByKey = {};

        for (const issue of (error as ErrorObject).issues) {
          const key = issue.path[0];
          if (!errorsByKey[key]) {
            errorsByKey[key] = [];
          }

          errorsByKey[key]!.push(issue.message);
        }
        setErrorsCreateCredentials(errorsByKey)
        console.error('Errors by key:', errorsByKey);
      } else {
        console.error('Unknown error:', error);
      }
    }
  }
  const DecryptData = (credential_id: number, credential_key: string, should_copy?: (text_to_copy: string) => void) => {
    ApiClient
      .get(
        `/credential/get_decryptes_values/${credential_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "credential_access_token"
            )}`,
          },
        }
      )
      .then((response) => {
        const Visible_SecretValues = [
          ...VisibleSecretValues,
        ];
        Visible_SecretValues.push(
          credential_id
        );

        setVisibleSecretValues(
          Visible_SecretValues
        );
        // Define should_copy callback function with access to responseData from API
        const should_copy_callback = () => {
          if (should_copy) {
            should_copy(response.data.data);
          }
        };
        // Call should_copy callback if provided, passing responseData from API
        should_copy_callback();

        setdecrypted_values_list((prevObject) => ({
          ...prevObject,
          [`${credential_key}_${credential_id}`]:
            response.data.data,
        }));
        /* // Call should_copy callback if provided
        if (should_copy) {
          should_copy();
        } */

      });
  }


  const fetchCredentials = async () => {
    const response = await ApiClient
      .get("/credential/credential_list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("credential_access_token")}`,
        },
      });
    /*  .then((response) => {
       console.log(response.data);
       setUserCredentials(response.data);
     }); */
    return response.data;
  };
  useEffect(() => {
    /*  fetchCredentials();
     console.log(decrypted_values_list); */
  }, []);
  //const { data: userCredentials, isLoading, isError } = useQuery<Category[]>('credentials', fetchCredentials);

  const { isLoading, isError, data, error } = useQuery<Category[], Error>('fetchCredentials', fetchCredentials)
  /*   if (isLoading) {
      return (<div className="w-full h-screen flex items-center justify-center ">
        <Spinner className="h-12 w-12" color="blue" />
      </div>)
    } */



  const deleteCategory = (category_id: number) => {
    return ApiClient
      .delete(`/credential/delete_category/${category_id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("credential_access_token")}`,
        }
      })
    /*  .then((response) => {
       console.log(JSON.stringify(response.data));
       fetchCredentials();
       setAlertData({
         color: "bg-red-500",
         text: "category has been deleted successfully",
       });
     })
     .catch((error) => {
       console.log(error);
     }); */
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const deleteCategoryMutation = useMutation(deleteCategory, {
    onSuccess: () => {
      //fetchCredentials();
      queryClient.invalidateQueries("fetchCredentials")
      setAlertData({
        color: "bg-red-500",
        text: "category has been deleted successfully",
      });
    }
  })
  /*  if (deleteCategoryMutation.isLoading) {
     return (
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-500"></div>
       </div>
     )
   } */
  /*
<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-500"></div>
        </div>
  */


  const deleteCredential = (credential_id: number) => {
    /*  const config = {
       method: "delete",
       maxBodyLength: Infinity,
       url: `/credential/delete_credential/${credential_id}`,
       headers: {
         Accept: "application/json",
         Authorization: `Bearer ${localStorage.getItem("credential_access_token")}`,
       },
     }; */

    ApiClient
      .delete(`/credential/delete_credential/${credential_id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("credential_access_token")}`,
        }
      })
      .then(() => {
        queryClient.invalidateQueries("fetchCredentials")
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const CopyToClipboardButton = (textToCopy: string) => {
    copy(textToCopy);
  };
  const createCategoryMutation = useMutation({
    mutationFn: (form_data: { categorie_name: string, categorie_description: string }) => {
      return ApiClient
        .post("/credential/create_category", form_data, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("credential_access_token")}`,
          }
        })
    },
    onSuccess: () => {
      setErrors(undefined);
      queryClient.invalidateQueries("fetchCredentials")
      handleOpen();
      setCategoryDesc("");
      setCategoryName("");
      setAlertData({
        color: "bg-green-500",
        text: "category has been created successfully",
      });
    }
  })
  const createCategory = () => {

    const category_schema = z.object({
      category_name: z
        .string()
        .min(2, { message: "category name must have more then 2 charachters" }),
      category_description: z
        .string()
        .min(2, {
          message: "category description must have more then 2 charachter",
        }),
    });
    try {
      category_schema.parse({
        category_name: CategoryName,
        category_description: CategoryDesc,
      });

      createCategoryMutation.mutate({ categorie_name: CategoryName, categorie_description: CategoryDesc, });


    } catch (error) {
      if (error instanceof ZodError) {
        const errorsByKey: ErrorsByKey = {};

        for (const issue of (error as ErrorObject).issues) {
          const key = issue.path[0];
          if (!errorsByKey[key]) {
            errorsByKey[key] = [];
          }

          errorsByKey[key]!.push(issue.message);
        }
        setErrors(errorsByKey);
        console.error("Errors by key:", errorsByKey);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };
  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <div className="bg-gray-50 w-full h-screen">
      {/*  <ComplexNavbar /> */}
      {isLoading ? (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      ) : null}
      {deleteCategoryMutation.isLoading ? (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      ) : null}
      {createCategoryMutation.isLoading ? (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      ) : null}
      <div className="w-full ">
        <br />
        <br />
        <div className="w-4/5  mx-auto">
          <Typography variant="h3" className="">
            Keys Credentials
          </Typography>
          <br />
          <Button onClick={handleOpen}>Create Category</Button>
          <Dialog
            size="xs"
            open={open}
            handler={handleOpen}
            className="bg-transparent shadow-none"
          >
            <Card className="mx-auto w-full max-w-[24rem]">
              <CardBody className="flex flex-col gap-4">
                <Typography variant="h4" color="blue-gray">
                  Create Category
                </Typography>

                <Typography className="-mb-2" variant="h6">
                  Category name
                </Typography>
                <Input
                  label="name"
                  size="lg"
                  value={CategoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                  }}
                  crossOrigin={undefined}
                />
                {Errors?.category_name?.map((err) => (
                  <p className="text-red-500">{err}</p>
                ))}
                <Typography className="-mb-2" variant="h6">
                  Category description
                </Typography>
                <Input
                  label="description"
                  size="lg"
                  value={CategoryDesc}
                  onChange={(e) => {
                    setCategoryDesc(e.target.value);
                  }}
                  crossOrigin={undefined}
                />
                {Errors?.category_description?.map((err) => (
                  <p className="text-red-500">{err}</p>
                ))}
              </CardBody>
              <CardFooter className="pt-0">
                <Button variant="gradient" onClick={createCategory} fullWidth>
                  Create
                </Button>
              </CardFooter>
            </Card>
          </Dialog>
        </div>
        <br />
        <Alert
          open={AlertData ? true : false}
          className={`w-4/5  mx-auto ${AlertData?.color}`}
          onClose={() => setAlertData(null)}
        >
          {AlertData?.text}
        </Alert>
        <br />
        {data != undefined && data.length == 0 ? (<Typography
          variant="lead"
          className="w-full flex justify-center items-center h-full"
        >
          <p>No Categories available</p>
        </Typography>) : null}

        {data?.map((item) => (
          <>
            <div
              key={item.categorie_id}
              className="w-4/5 mx-auto px-10 py-5 rounded-xl flex my-5"
            >
              <Typography variant="lead" className=" w-1/4   ">
                <p className="bg-gray-600 text-white text-center w-full rounded-lg">

                  {item.categorie_name}
                </p>
              </Typography>
              <div className="w-3/4 flex justify-end">
                <Button onClick={handleOpenCreateCredential}>Add new credentials</Button>
                <Button onClick={handleOpenCreateCredentialsAsFile} className="mx-2">Add new credentials As File</Button>
                <Dialog
                  size="xs"
                  open={openCreateCredentialsAsFile}
                  handler={handleOpenCreateCredentialsAsFile}
                  className="bg-transparent shadow-none"
                >
                  <Card className="mx-auto w-full max-w-[24rem]">
                    <CardBody className="flex flex-col gap-4">
                      <Typography variant="h4" color="blue-gray">
                        Add new credential as file
                      </Typography>

                      <Typography className="-mb-2" variant="h6">
                        credential key
                      </Typography>
                      <Input label="key" size="lg" onChange={(e) => { setcredential_key(e.target.value); }} crossOrigin={undefined} />
                      {ErrorsCreateCredentialsAsFile?.credential_key?.map((err) => (
                        <p className='text-red-500'>
                          {err}
                        </p>
                      ))}
                      <Typography className="-mb-2" variant="h6">
                        credential value
                      </Typography>
                      <Input label="value" type="file" size="lg" onChange={(e) => { handleFileChange(e); }} crossOrigin={undefined} />
                      {ErrorsCreateCredentialsAsFile?.credential_value?.map((err) => (
                        <p className='text-red-500'>
                          {err}
                        </p>
                      ))}
                    </CardBody>
                    <CardFooter className="pt-0">
                      <Button variant="gradient" onClick={() => {
                        SaveCredentialsAsFile(item.categorie_id)
                      }} fullWidth>
                        add
                      </Button>

                    </CardFooter>
                  </Card>
                </Dialog>
                <Dialog
                  size="xs"
                  open={openCreateCredential}
                  handler={handleOpenCreateCredential}
                  className="bg-transparent shadow-none"
                >
                  <Card className="mx-auto w-full max-w-[24rem]">
                    <CardBody className="flex flex-col gap-4">
                      <Typography variant="h4" color="blue-gray">
                        Add new credential
                      </Typography>

                      <Typography className="-mb-2" variant="h6">
                        credential key
                      </Typography>
                      <Input label="key" size="lg" onChange={(e) => { setcredential_key(e.target.value); }} crossOrigin={undefined} />
                      {ErrorsCreateCredentials?.credential_key?.map((err) => (
                        <p className='text-red-500'>
                          {err}
                        </p>
                      ))}
                      <Typography className="-mb-2" variant="h6">
                        credential value
                      </Typography>
                      <Input label="value" size="lg" onChange={(e) => { setcredential_value(e.target.value); }} crossOrigin={undefined} />
                      {ErrorsCreateCredentials?.credential_value?.map((err) => (
                        <p className='text-red-500'>
                          {err}
                        </p>
                      ))}
                    </CardBody>
                    <CardFooter className="pt-0">
                      <Button variant="gradient" onClick={() => {
                        SaveCredentials(item.categorie_id)
                      }} fullWidth>
                        add
                      </Button>

                    </CardFooter>
                  </Card>
                </Dialog>


                <Button
                  color="red"
                  className="mx-1"
                  onClick={() => {
                    // deleteCategory(item.categorie_id);
                    deleteCategoryMutation.mutate(item.categorie_id)
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            </div>
            {item.cridentials.length > 0 ? (
              item.cridentials.map((item_credentials) => (
                <div
                  key={item_credentials.credential_id}
                  className="w-4/5 bg-white mx-auto px-10 py-5 rounded-xl flex my-5"
                >
                  <Typography variant="lead" className=" w-1/4">
                    {item_credentials.credential_key}
                  </Typography>
                  <div className="w-2/4 flex justify-start">
                    {item_credentials.credential_type == "text" ? (
                      <Typography variant="lead">
                        {VisibleSecretValues.includes(
                          item_credentials.credential_id
                        ) ? (
                          <>
                            {/*  {item_credentials.credential_value} */}
                            <span className="mr-1">
                              {
                                decrypted_values_list[
                                `${item_credentials.credential_key}_${item_credentials.credential_id}`
                                ]
                              }
                            </span>
                            <FontAwesomeIcon
                              icon={faEyeSlash}
                              className="cursor-pointer"
                              onClick={() => {
                                let Visible_SecretValues = [
                                  ...VisibleSecretValues,
                                ];
                                Visible_SecretValues =
                                  Visible_SecretValues.filter(
                                    (item) =>
                                      item !== item_credentials.credential_id
                                  );
                                setVisibleSecretValues(Visible_SecretValues);
                              }}
                            />
                          </>
                        ) : (
                          <div className="flex">
                            <span className="mr-1">{"*".repeat(10)}</span>
                            <FontAwesomeIcon
                              icon={faEye}
                              className="cursor-pointer"
                              onClick={() => {
                                DecryptData(item_credentials.credential_id, item_credentials.credential_key)
                              }}
                            />
                          </div>
                        )}
                      </Typography>
                    ) : <>
                      <IconButton color="blue" onClick={() => {
                        DonwnloadFile(item_credentials.credential_value)
                      }}>
                        <FontAwesomeIcon icon={faDownload} />
                      </IconButton>
                    </>}

                  </div>
                  <div className="w-1/4 flex justify-end">
                    <IconButton
                      color="red"
                      onClick={() => {
                        deleteCredential(item_credentials.credential_id);
                        setAlertData({
                          color: "bg-red-500",
                          text: "credential has been deleted successfully",
                        });
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                    {item_credentials.credential_type == "text" ?  <IconButton
                      color="blue"
                      className="mx-2"
                      onClick={() => {
                        DecryptData(item_credentials.credential_id, item_credentials.credential_key, (responseData) => {
                          console.log(responseData)
                          CopyToClipboardButton(
                            responseData
                          );
                          setAlertData({
                            color: "bg-gray-500",
                            text: "value has been copied successfully",
                          });
                        })
                      }}
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </IconButton> : null}
                   
                    {/*  <CreateCredentials category_id={item_credentials.categorie_id} fetchCredentials={fetchCredentials} /> */}
                  </div>
                </div>
              ))
            ) : (
              <div className="w-4/5 bg-white mx-auto px-10 py-5 rounded-xl flex my-5">
                <Typography variant="lead" className="w-3/4">
                  No credentials available
                </Typography>

              </div>
            )}
          </>
        ))}

      </div>
    </div>
  );
}

export default ListCredentials;

