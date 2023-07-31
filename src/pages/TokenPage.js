import { useState } from 'react';

import { Helmet } from 'react-helmet-async';
// @mui
import { Button, Container, Stack, Typography } from '@mui/material';


export default function TokenPage() {
    const [token, setToken] = useState("No token");
    const [refreshToken, setRefreshToken] = useState("No refresh token");
    const [accessTokenExpirationTime, setAccessTokenExpirationTime] = useState(new Date(1990, 0, 1));
    const [refreshTokenExpirationTime, setRefreshTokenExpirationTime] = useState(new Date(1990, 0, 1));
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
        if (code === undefined) {
            console.error("Get a code first..");
            return;
        }
        fetch(
            "server",
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
                    setToken(responseJson.token);
                    setRefreshToken(responseJson.refreshToken);
                    const accessTokenExpirationTime = new Date();
                    const refreshTokenExpirationTime = new Date();
                    accessTokenExpirationTime.setSeconds(accessTokenExpirationTime.getSeconds() + responseJson.expires_in);
                    refreshTokenExpirationTime.setSeconds(refreshTokenExpirationTime.getSeconds() + responseJson.refresh_token_expires_in);
                    setAccessTokenExpirationTime(accessTokenExpirationTime);
                    setRefreshTokenExpirationTime(refreshTokenExpirationTime);                    
                });
            } else {
                // demo.processError(response);
            }
        }).catch((error) => {
            console.error(error);
        });
    }
    return (
        <>
            <Helmet>
                <title> Token Page </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Get Token
                    </Typography>
                </Stack>

                <Typography variant='h5'>
                    Code: {getCode()}
                </Typography>
                <Button fullWidth size="large" type="submit" variant="contained" onClick={getToken}>
                    Get token
                </Button>
                
                <Typography variant='h6'>
                    Token: {token}
                </Typography>
                <Typography variant='h6'>
                    Refresh token: {refreshToken}
                </Typography>
                <Typography variant='h6'>
                    Access token expires: {accessTokenExpirationTime.toLocaleString()}
                </Typography>
                <Typography variant='h6'>
                    Refresh token expires: {refreshTokenExpirationTime.toLocaleString()}
                </Typography>
            </Container>
        </>

    )
}