"use client";
import { submitContactForm } from "@/lib/actions/contact";
import { ContactSchema } from "@/validations/contacts";
import { useActionState, useState } from "react";
import { z } from "zod";
import { set } from "zod/v4";

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, {
    success: false,
    errors: {},
  });

  const [clientErrors, setClientError] = useState({ name: "", email: "" });

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    try {
      if (name === "name") {
        ContactSchema.pick({ name: true }).parse({ name: value });
      } else if (name === "email") {
        ContactSchema.pick({ email: true }).parse({ email: value });
        setClientError((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors[0]?.message || "";
        setClientError((prev) => ({
          ...prev,
          [name]: errorMessage,
        }));
      }
    }
  };

  return (
    <div>
      <form action={formAction}>
        <div className="py-24 text-gray-600">
          <div className="mx-auto flex flex-col bg-white shadow-md p-8 md:w-1/2">
            <h2 className="text-lg mb-2">inquire</h2>
            <div className="mb-4">
              <label htmlFor="name" className="text-sm">
                name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                onBlur={handleBlur}
                className="
                            w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none py-1 px-3 leading-8"
              ></input>
              {state.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.name.join(",")}
                </p>
              )}
              {clientErrors.name && (
                <p className="text-red-500 text-sm mt-1">{clientErrors.name}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="text-sm">
                mail address
              </label>
              <input
                type="text"
                id="email"
                name="email"
                onBlur={handleBlur}
                className="
                            w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none py-1 px-3 leading-8"
              ></input>
              {state.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.email.join(",")}
                </p>
              )}
              {clientErrors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {clientErrors.email}
                </p>
              )}
            </div>
            <button className="text-white bg-indigo-500 py-2 px-6 hover:bg-indigo-600 rounded text-lg">
              send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
