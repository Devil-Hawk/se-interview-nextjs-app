"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";


export function QueryProvider({children}:{children: React.ReactNode}){
    //Calling arrow function only once when the component first loads, this client would live on runtime so that Cache can stay intact.
    const [queryClient] = useState(() => new QueryClient())
    return (<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>)
}