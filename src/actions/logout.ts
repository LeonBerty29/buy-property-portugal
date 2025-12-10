"use server";

import { signOut } from "@/auth";


export const logout = async () => {


  try {
    await signOut();
    console.log("user logout successfully")
  } catch (error) {
    console.log("An error occured while trying to logout the user", error)
  }
};
