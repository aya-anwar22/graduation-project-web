import { useState } from "react";
import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
    InputAdornment,
    useTheme,
    alpha,
    Alert,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { forgetPassword } from "../Student/services";
import EmailIcon from '@mui/icons-material/Email';
import LockResetIcon from '@mui/icons-material/LockReset';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

export const ForgetPassword = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            setError("الرجاء إدخال البريد الإلكتروني");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const data = await forgetPassword({ email });

            if ("error" in data) {
                setError(data.error || "فشل في إرسال طلب إعادة التعيين");
                console.log("Forget Password error:", data.error);
            } else {
                setSuccess("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
                setTimeout(() => navigate("/reset-password"), 3000);
            }
        } catch (error: any) {
            setError(error.message || "حدث خطأ غير متوقع");
            console.log("Unexpected error:", error.message || error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
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
                            <LockResetIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
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
                            نسيت كلمة المرور؟
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontSize: '1.1rem' }}
                        >
                            أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
                        </Typography>
                    </Box>

                    {/* Success Message */}
                    {success && (
                        <Alert 
                            icon={<MarkEmailReadIcon fontSize="inherit" />}
                            severity="success" 
                            sx={{ 
                                mb: 3,
                                borderRadius: 2,
                                animation: 'fadeIn 0.5s ease',
                            }}
                        >
                            {success}
                        </Alert>
                    )}

                    {/* Error Message */}
                    {error && (
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
                            {error}
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
                            disabled={loading || !!success}
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

                        {/* Submit Button */}
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={loading || !!success}
                            size="large"
                            startIcon={loading ? <CircularProgress size={20} /> : <LockResetIcon />}
                            sx={{
                                mt: 3,
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
                            {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
                        </Button>

                        {/* Back to Login Link */}
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => navigate("/login")}
                            disabled={loading}
                            startIcon={<ArrowBackIcon />}
                            sx={{
                                mt: 2,
                                py: 1,
                                color: theme.palette.primary.main,
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            العودة لتسجيل الدخول
                        </Button>

                        {/* Info Box */}
                        <Box 
                            sx={{ 
                                mt: 3, 
                                p: 2, 
                                bgcolor: alpha(theme.palette.info.main, 0.05),
                                borderRadius: 2,
                                border: `1px dashed ${alpha(theme.palette.info.main, 0.3)}`,
                            }}
                        >
                            <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
                                سيتم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
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