import React, { useState } from 'react'
import {
    Button,
    Dialog,
    Card,
    CardBody,
    CardFooter,
    Typography,
    Input
} from "@material-tailwind/react";
import { ZodError, z } from 'zod';
import { IAlertData } from '../AppInterfaces/IAlertData';
import { ApiClient } from '../API/ApiClient';

interface CreateCredentialsPrpos {
    category_id: number | null;
    fetchCredentials: () => void;
    setAlertData: React.Dispatch<React.SetStateAction<IAlertData | null>>;
}
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

function CreateCredentials({ category_id, fetchCredentials, setAlertData }: CreateCredentialsPrpos) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen((cur) => !cur);
    const [credential_key, setcredential_key] = useState("");
    const [credential_value, setcredential_value] = useState("");
    const [Errors, setErrors] = useState<ErrorsByKey>()
    const SaveCredentials = () => {
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
            setErrors(undefined)
            console.log(category_id)
            const api_data = JSON.stringify({
                "credential_key": credential_key,
                "credential_value": credential_value,
                "categorie_id": category_id
            });
            /*    const config = {
                   method: 'post',
                   maxBodyLength: Infinity,
                   url: 'http://127.0.0.1:8000/api/credential/create_credential',
                   headers: {
                       'Accept': 'application/json',
                       'Content-Type': 'application/json',
                       "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                   },
                   data: api_data
               }; */

            ApiClient.post("/credential/create_credential", api_data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem("credential_access_token")}`
                }
            })
                .then((response) => {
                    fetchCredentials()
                    setOpen((cur) => !cur)
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
                setErrors(errorsByKey)
                console.error('Errors by key:', errorsByKey);
            } else {
                console.error('Unknown error:', error);
            }
            // console.log(err.errors)
        }
    }
    return (
        <>
            <Button onClick={handleOpen}>Add new credentials</Button>
            <Dialog
                size="xs"
                open={open}
                handler={handleOpen}
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
                        {Errors?.credential_key?.map((err) => (
                            <p className='text-red-500'>
                                {err}
                            </p>
                        ))}
                        <Typography className="-mb-2" variant="h6">
                            credential value
                        </Typography>
                        <Input label="value" size="lg" onChange={(e) => { setcredential_value(e.target.value); }} crossOrigin={undefined} />
                        {Errors?.credential_value?.map((err) => (
                            <p className='text-red-500'>
                                {err}
                            </p>
                        ))}
                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button variant="gradient" onClick={SaveCredentials} fullWidth>
                            add
                        </Button>

                    </CardFooter>
                </Card>
            </Dialog>
        </>
    )
}

export default CreateCredentials