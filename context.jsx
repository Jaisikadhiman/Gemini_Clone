import { createContext, useState } from "react";
import runChat from "../../config/config";

export const Context = createContext();
const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord);
        }, 75 * index
        )
    }
    const newChat =()=>{
        setLoading(false);
        setShowResult(false);
    }
   
    const onsent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;
        if(prompt!== undefined){
          response=  await runChat(prompt);
            setRecentPrompt(prompt)
        }else{
            setPrevPrompts(prev=>[...prev,input])
            setRecentPrompt(input);
         response = await runChat(input);
        }
       
        let responseArray = response.split("**");
        let newResponse="";
        for (let item = 0; item < responseArray.length; item++) {
            if (item === 0 || item % 2 !== 1) {
                newResponse += responseArray[item]
            } else {
                newResponse += "<b>" + responseArray[item] + "</b>"
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>")
        let newResponseArray = newResponse2.split(" ");
        for (let item = 0; item < newResponseArray.length; item++) {
            const nextWord = newResponseArray[item];
            delayPara(item, nextWord + " ");
        }
        setLoading(false);
        setInput("");
    }

    //this is variable in this we will define any function or object that can we use anywhere in out project component
    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onsent,
        setRecentPrompt,
        recentPrompt,
        input,
        setInput,
        loading,
        resultData,
        showResult,
        newChat
    }
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}
export default ContextProvider;