import { useEffect, useState } from "react";
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
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons/faEyeSlash";
import { faCopy } from "@fortawesome/free-solid-svg-icons/faCopy";
import copy from "copy-to-clipboard";
import { IAlertData } from "../../AppInterfaces/IAlertData";
import CreateCredentials from "../../Components/CreateCredentials";
import { Category } from "../../Types/Category";
import { ZodError, z } from "zod";
import { ApiClient } from "../../API/ApiClient";
import { useMutation, useQuery, useQueryClient } from "react-query";
interface Issue {
  path: string[];
  message: string;
}

interface ErrorObject {
  issues: Issue[];
}

interface ErrorsByKey {
  [key: string]: string[] | undefined;
}

function ListCredentials() {
  // const [UserCredentials, setUserCredentials] = useState<Category[]>([]);
  const [AlertData, setAlertData] = useState<IAlertData | null>(null);
  const [VisibleSecretValues, setVisibleSecretValues] = useState<number[]>([]);
  const [decrypted_values_list, setdecrypted_values_list] = useState<
    Record<string, string>
  >({});
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const [Errors, setErrors] = useState<ErrorsByKey>();
  const [CategoryName, setCategoryName] = useState("");
  const [CategoryDesc, setCategoryDesc] = useState("");
  const queryClient = useQueryClient();
  const fetchCredentials = async () => {
    const response = await ApiClient
      .get("http://127.0.0.1:8000/api/credential/credential_list", {
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
       url: `http://127.0.0.1:8000/api/credential/delete_credential/${credential_id}`,
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
        fetchCredentials();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const CopyToClipboardButton = (textToCopy: string) => {
    copy("Text" + textToCopy);
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
    //
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
      /*  const api_data = JSON.stringify({
         categorie_name: CategoryName,
         categorie_description: CategoryDesc,
       }); */
      createCategoryMutation.mutate({ categorie_name: CategoryName, categorie_description: CategoryDesc, });

      /* .then((response) => {
        console.log(JSON.stringify(response.data));
        setErrors(undefined);
        fetchCredentials();
        handleOpen();
        setCategoryDesc("");
        setCategoryName("");
        setAlertData({
          color: "bg-green-500",
          text: "category has been created successfully",
        });
      })
      .catch((error) => {
        console.log(error);
      }); */
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
        {/*  {UserCredentials.length <= 0 ? (
          <Typography
            variant="lead"
            className="w-full flex justify-center items-center h-full"
          >
            <p>No Categories available</p>
          </Typography>
        ) : (
          
        )} */}
        {data?.map((item) => (
          <>
            <div
              key={item.categorie_id}
              className="w-4/5 mx-auto px-10 py-5 rounded-xl flex my-5"
            >
              <Typography variant="lead" className=" w-3/4 ">
                <p className="bg-black text-white text-center w-1/12 rounded-lg">

                  {item.categorie_name}
                </p>
              </Typography>
              <div className="w-1/4 flex justify-end">
                <CreateCredentials
                  category_id={item.categorie_id}
                  fetchCredentials={fetchCredentials}
                  setAlertData={setAlertData}
                />
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
                              ApiClient
                                .get(
                                  `http://127.0.0.1:8000/api/credential/get_decryptes_values/${item_credentials.credential_id}`,
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
                                    item_credentials.credential_id
                                  );

                                  setVisibleSecretValues(
                                    Visible_SecretValues
                                  );

                                  setdecrypted_values_list((prevObject) => ({
                                    ...prevObject,
                                    [`${item_credentials.credential_key}_${item_credentials.credential_id}`]:
                                      response.data.data,
                                  }));
                                });
                            }}
                          />
                        </div>
                      )}
                    </Typography>
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
                    <IconButton
                      color="blue"
                      className="mx-2"
                      onClick={() => {
                        CopyToClipboardButton(
                          item_credentials.credential_value
                        );
                        setAlertData({
                          color: "bg-gray-500",
                          text: "value has been copied successfully",
                        });
                      }}
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </IconButton>
                    {/*  <CreateCredentials category_id={item_credentials.categorie_id} fetchCredentials={fetchCredentials} /> */}
                  </div>
                </div>
              ))
            ) : (
              <div className="w-4/5 bg-white mx-auto px-10 py-5 rounded-xl flex my-5">
                <Typography variant="lead" className="w-3/4">
                  No credentials available
                </Typography>
                {/*   <div className="w-1/4 flex justify-end">
                  </div> */}
              </div>
            )}
          </>
        ))}
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}

export default ListCredentials;

/**
 * 
 * mfa sms email 
 * 
 */