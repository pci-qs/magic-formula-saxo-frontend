import { useState, useEffect } from 'react';

import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Stack, Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';

const serverUrl = "http://localhost:1337/api/authentication"

export default function TokenPage() {    
    const [hasToken, setHasToken] = useState(false);    
    
    useEffect(() => {
        if (!hasToken){
            getToken();
        }
        else{
            Navigate({to: '/dashboard/app'});
        }
    }, [hasToken])
    let code;
    /**
     * After a successful authentication, the code can be found as query parameter.
     * @return {void}
     */
    function getCode() {
        const urlParams = new window.URLSearchParams(window.location.search);
        code = urlParams.get("code");
        if (code === null) {
            console.error("No code found!");
        } else {
            console.log(`Found code: ${decodeURIComponent(code)}`);
        }
        return code;
    }

    const getToken =() => {
        getCode();
        if (code === undefined) {
            console.error("Get a code first..");
            return;
        }
        fetch(
            `${serverUrl}/token`,
            {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json; charset=utf-8",
                    "Accept": "application/json; charset=utf-8"
                },
                "body": JSON.stringify({
                    "code": code
                })
            }
        ).then((response) => {
            if (response.ok) {                
                response.json().then((responseJson) => {
                    const {data} = responseJson;
                    if (data === "Token received"){
                        setHasToken(true);
                    }                  
                    else{
                        setHasToken(false);
                    }
                });
            } else {
                setHasToken(false);
            }
        }).catch((error) => {
            console.error(error);
            setHasToken(false);
        });
    }
    
    return (
        <>
            <Helmet>
                <title> Token Page </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h5" gutterBottom>
                        {hasToken? "Token received": "Receiving Token"}
                    </Typography>
                </Stack>
            </Container>
        </>

    )
}