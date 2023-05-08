import React, { useState } from 'react';
import { Checkbox, FormControlLabel, Button, Box, CssBaseline, Container, Stack } from '@mui/material';
import { ReactComponent as Logo } from '@assets/logo/logo_neon.svg';
import BackgroundInput from '@components/Input/BackgroundInput';

const HorizonLine = () => {
  return (
    <Box
      sx={{
        width: '100%',
        borderBottom: '1px solid #56CFE1',
        opacity: '30%',
        margin: '10px 0 10px',
      }}
    />
  );
};

const Login = () => {
  const [isValidId, setIsValidId] = useState<boolean>(false);
  const [isKeepLogin, setIsKeepLogin] = useState<boolean>(false);
  const [form, setForm] = useState({
    id: '',
    password: '',
  });
  const { id, password } = form;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    data.append('id', id);
    data.append('password', password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsKeepLogin(!e.target.checked);
  };

  const handleIdValidation = () => {
    setIsValidId(/[^ㄱ-ㅎ가-힣a-zA-Z]/g.test(id));
  };

  return (
    <CssBaseline>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Logo className="mb-5 h-20" />

          <Stack component="form" onSubmit={handleSubmit} width="100%">
            <BackgroundInput
              sx={{ mb: 2 }}
              label="아이디"
              required
              fullWidth
              placeholder="ID"
              error={isValidId}
              helperText={isValidId && '아이디를 입력해주세요'}
              name="id"
              value={id}
              onChange={handleChange}
              onBlur={handleIdValidation}
            />
            <BackgroundInput
              sx={{ mb: 2 }}
              label="비밀번호"
              required
              fullWidth
              placeholder="PW"
              name="password"
              value={password}
              onChange={handleChange}
              onBlur={handleIdValidation}
            />
            <Button variant="outlined" sx={{ height: 56 }}>
              로그인
            </Button>
            <FormControlLabel
              control={<Checkbox value={isKeepLogin} color="primary" onChange={handleCheckboxChange} />}
              label="로그인 상태 유지"
            />
          </Stack>
          <HorizonLine />
          <Stack direction="row" spacing={2}>
            <p>아이디·비밀번호 찾기</p>
            <p>|</p>
            <p>회원가입</p>
          </Stack>
        </Box>
      </Container>
    </CssBaseline>
  );
};

export default Login;
