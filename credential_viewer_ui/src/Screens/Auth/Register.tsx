import { FormEvent, useState } from "react";
import { ZodError, z } from 'zod';
import { NavLink, useNavigate } from "react-router-dom";
import { ApiClient } from "../../API/ApiClient";

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
function Register() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Name, setName] = useState("");
  const [Errors, setErrors] = useState<ErrorsByKey>()
  const navigate = useNavigate();

  const Register = (e: FormEvent) => {
    e.preventDefault();
    const user_login_schema = z.object({
      email: z.string().min(10, { message: "email must have more then 10 charachters" }).email().max(255),
      password: z.string().min(10, { message: "password must have more then 10 charachter" }).max(255),
      name: z.string().min(2, { message: "name must have more then 2 charachter" }).max(255),
    });
    try {
      const data = user_login_schema.parse({
        email: Email,
        password: Password,
        name: Name
      })
      console.log(data)
      setErrors(undefined)
      /*  const config = {
         method: 'post',
         maxBodyLength: Infinity,
         url: 'http://127.0.0.1:8000/api/register',
         headers: { 
           'Accept': 'application/json', 
         },
         data : {
           'email':Email,
           'password':Password,
           "name":Name
         }
       }; */

      ApiClient.post("/register", {
        'email': Email,
        'password': Password,
        "name": Name
      })
        .then((response) => {
          console.log(JSON.stringify(response.data));
          localStorage.setItem("credential_user", JSON.stringify(response.data.user));
          localStorage.setItem("credential_access_token", response.data.access_token);
          navigate("/credential-list", { replace: true })
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
    }

  }
  return (
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
        <img
          src="https://source.unsplash.com/random"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
                    flex items-center justify-center"
      >
        <div className="w-full h-100">
          <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
            Create a new account
          </h1>
          <form className="mt-6" action="#" method="POST" onSubmit={Register}>
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name=""
                id=""
                value={Name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Enter Name"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                autoComplete=""
              />
              {Errors?.name?.map((err) => (
                <p className='text-red-500'>
                  {err}
                </p>
              ))}
            </div>
            <div>
              <label className="block text-gray-700">Email Address</label>
              <input
                type="email"
                name=""
                id=""
                value={Email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="Enter Email Address"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                autoComplete=""
              />
              {Errors?.email?.map((err) => (
                <p className='text-red-500'>
                  {err}
                </p>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name=""
                id=""
                value={Password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Enter Password"

                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
                                            focus:bg-white focus:outline-none"
              />
              {Errors?.password?.map((err) => (
                <p className='text-red-500'>
                  {err}
                </p>
              ))}
            </div>
            {/*   <div className="text-right mt-2">
              <a
                href="#"
                className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
              >
                Forgot Password?
              </a>
            </div> */}
            <button
              type="submit"
              className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg
                                    px-4 py-3 mt-6"
            >
              Create Account
            </button>
          </form>
          <hr className="my-6 border-gray-300 w-full" />

          <p className="mt-8">
            Have already an account?{" "}
            <NavLink
              to="/login"
              className="text-blue-500 hover:text-blue-700 font-semibold"
            >
              Log in
            </NavLink>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Register;
