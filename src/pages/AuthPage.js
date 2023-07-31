import { Helmet } from 'react-helmet-async';
// @mui
import { Button, Container, Stack, Typography } from '@mui/material';

const clientId = "ac4904e1dd514e72b4379c756ece06c5";
const redirectUrl = "http://localhost:3000/token"
const authUrl = "https://sim.logonvalidation.net/authorize";

export default function AuthPage() {

/**
     * This function generates a cryptographically strong random value.
     * https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
     * @return {string} A 'real' random value
     */
function getRandomValue() {
    const randomValues = new Uint32Array(1);
    window.crypto.getRandomValues(randomValues);
    return randomValues[0].toString();
}

/**
 * A CSRF (Cross Site Request Forgery) Token is a secret, unique and unpredictable value an application generates in order to protect CSRF vulnerable resources.
 * @return {string} The CSRF token
 */
function createCsrfToken() {
    const csrfToken = getRandomValue();
    // Save the token to local storage, so after authentication this can be compared with the incoming token:
    try {
        window.localStorage.setItem("csrfToken", csrfToken);
    } catch (ignore) {
        console.error("Unable to remember token (LocalStorage not supported).");  // As an alternative, a cookie can be used
    }
    return csrfToken;
}

/**
 * If login failed, the error can be found as a query parameter.
 * @return {void}
 */
function generateLink() {
    // State contains a unique number, which must be stored in the client and compared with the incoming state after authentication
    // It is passed as base64 encoded string
    // https://auth0.com/docs/protocols/oauth2/oauth-state
    const stateString = window.btoa(JSON.stringify({
        // Token is a random number - other data can be added as well
        "csrfToken": createCsrfToken(),
        "state": "Saxo Demo App State"
    }));
    const url = `${authUrl}?client_id=${encodeURIComponent(clientId)}&response_type=code&state=${encodeURIComponent(stateString)}&redirect_uri=${encodeURIComponent(redirectUrl)}`;
    return url;
    
}

    return (
        <>
            <Helmet>
                <title> Authentication Page </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Authentication
                    </Typography>                    
                </Stack>
                
                <Button href={generateLink()}>Authorize</Button>
                
            </Container>
        </>

    )
}