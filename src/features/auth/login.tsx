import { useState } from "react";
import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    Divider,
    useTheme,
    alpha,
    Alert,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../Student/services";
import { toast, ToastContainer } from "react-toastify";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LockResetIcon from '@mui/icons-material/LockReset';

export const LoginForm = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(null);
        setLoading(true);

        try {
            const data = await login({ email, password });

            if ("error" in data) {
                console.log("Login error:", data.error);
                setLoginError(data.error);
                toast.error(data.error);
                return;
            }
            
            // localStorage.setItem("accessToken", data.data.accessToken);
            // localStorage.setItem("refreshToken", data.data.refreshToken);

            navigate("/");
        } catch (error: any) {
            console.log("Unexpected error:", error.message || error);
            setLoginError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Container maxWidth="sm">
            <ToastContainer position="top-left" rtl={true} />
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 4,
                }}
            >
                <Paper
                    elevation={24}
                    sx={{
                        width: "100%",
                        p: { xs: 3, sm: 5 },
                        borderRadius: 4,
                        background: theme.palette.mode === 'dark' 
                            ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
                            : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 10px 40px rgba(0,0,0,0.4)'
                            : '0 10px 40px rgba(0,0,0,0.1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, #667eea, #764ba2, #6b8cff, #9f7aea)',
                        },
                    }}
                >
                    {/* Header Section */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            }}
                        >
                            <LoginIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                        </Box>
                        
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1,
                                fontSize: { xs: '2rem', sm: '2.5rem' },
                            }}
                        >
                            مرحباً بعودتك
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontSize: '1.1rem' }}
                        >
                            سجل دخولك للوصول إلى حسابك
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {loginError && (
                        <Alert 
                            severity="error" 
                            sx={{ 
                                mb: 3,
                                borderRadius: 2,
                                animation: 'shake 0.5s ease-in-out',
                                '@keyframes shake': {
                                    '0%, 100%': { transform: 'translateX(0)' },
                                    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
                                    '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
                                },
                            }}
                        >
                            {loginError}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <TextField
                            fullWidth
                            label="البريد الإلكتروني"
                            type="email"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 5px 15px ${alpha(theme.palette.primary.main, 0.2)}`,
                                    },
                                    '&.Mui-focused': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 5px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                    },
                                },
                            }}
                        />

                        {/* Password Field */}
                        <TextField
                            fullWidth
                            label="كلمة المرور"
                            type={showPassword ? "text" : "password"}
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="primary" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleTogglePassword}
                                            edge="end"
                                            disabled={loading}
                                        >
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 5px 15px ${alpha(theme.palette.primary.main, 0.2)}`,
                                    },
                                    '&.Mui-focused': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 5px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                    },
                                },
                            }}
                        />

                        {/* Forgot Password Link */}
                        <Box sx={{ textAlign: 'left', mt: 1, mb: 2 }}>
                            <Button
                                variant="text"
                                onClick={() => navigate("/forget-password")}
                                disabled={loading}
                                startIcon={<LockResetIcon />}
                                sx={{
                                    color: theme.palette.primary.main,
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                نسيت كلمة المرور؟
                            </Button>
                        </Box>

                        {/* Login Button */}
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            size="large"
                            startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                            sx={{
                                mt: 2,
                                py: 1.5,
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                borderRadius: 2,
                                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                boxShadow: `0 3px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 5px 20px ${alpha(theme.palette.primary.main, 0.6)}`,
                                },
                                '&:disabled': {
                                    background: theme.palette.mode === 'dark' 
                                        ? 'linear-gradient(45deg, #444 30%, #555 90%)'
                                        : 'linear-gradient(45deg, #ccc 30%, #ddd 90%)',
                                },
                            }}
                        >
                            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                        </Button>

                        {/* Divider */}
                        <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                أو
                            </Typography>
                        </Divider>

                        {/* Sign Up Button */}
                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            onClick={() => navigate("/sign-up")}
                            disabled={loading}
                            startIcon={<PersonAddIcon />}
                            sx={{
                                py: 1.5,
                                fontSize: "1rem",
                                borderRadius: 2,
                                borderWidth: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderWidth: 2,
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 5px 15px ${alpha(theme.palette.primary.main, 0.2)}`,
                                },
                            }}
                        >
                            إنشاء حساب جديد
                        </Button>

                        {/* Demo Credentials - Optional */}
                        <Box 
                            sx={{ 
                                mt: 3, 
                                p: 2, 
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                borderRadius: 2,
                                border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                            }}
                        >
                            <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
                                بيانات تجريبية: demo@example.com / password123
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            {/* Animation Styles */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </Container>
    );
};