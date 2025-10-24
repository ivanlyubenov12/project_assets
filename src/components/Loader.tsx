import { useEffect, useState } from "react";
import {OrbitProgress} from "react-loading-indicators";

export default function Loader(){
    return (
        <OrbitProgress dense color="#5246FF" size="medium" text="" textColor="" />
    );
}