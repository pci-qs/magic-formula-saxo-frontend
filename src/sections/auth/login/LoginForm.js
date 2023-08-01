import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { login } from '../../../apiClient/users';
import { isSaxoTokenValid } from '../../../apiClient/tokenStatus';
import account from '../../../_mock/account';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const handleClick = () => {
    setIsSubmitting(true);
    login(email, password)
      .then(response => {
        setIsSubmitting(false);
        if (response.status === 200) {
          account.displayName = response.name;
          account.email = response.email;
          isSaxoTokenValid()
            .then(response => {
              if (response.isTokenValid) {
                navigate('/dashboard', { replace: true });
              }
              else {
                navigate('/authorize', { replace: true });
              }
            })
            .catch(() => {
              navigate('/authorize', { replace: true });
            })

        }
        else {
          setErrorMessage(`Wrong email or password`);
        }

      })
      .catch(error => {
        setIsSubmitting(false);
        setErrorMessage(error.message);
      })

  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address"
          type="email"
          onChange={handleEmailChange}
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={handlePasswordChange}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick} loading={isSubmitting}>
        Login
      </LoadingButton>
      {errorMessage !== undefined &&
        <Typography sx={{ color: 'error.main', mb: 5 }} align='center'>{errorMessage}</Typography>
      }
    </>
  );
}
