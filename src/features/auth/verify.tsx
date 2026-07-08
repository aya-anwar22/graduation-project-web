import { useState } from "react";
import {
    Box,
    Button,
    Container,
    Paper,
    Typography,
    TextField,
    InputAdornment,
    useTheme,
    alpha,
    Alert,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { verify } from "../Student/services";
import EmailIcon from '@mui/icons-material/Email';
import PinIcon from '@mui/icons-material/Pin';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const Verify = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !code) {
            setError("الرجاء إدخال البريد الإلكتروني وكود التحقق");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await verify({ email, code });

            if ('error' in data) {
                setError(data.error || "فشل التحقق");
                console.log("Verification error:", data.error);
            } else {
                navigate('/login');
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
                    {/* Header */}
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
                            <VerifiedIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
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
                            تحقق من حسابك
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontSize: '1.1rem' }}
                        >
                            أدخل كود التحقق المرسل إلى بريدك الإلكتروني
                        </Typography>
                    </Box>

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

                    {/* Form */}
                    <Box 
                        component="form" 
                        onSubmit={handleSubmit}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                        }}
                    >
                        {/* Email Field */}
                        <TextField
                            fullWidth
                            label="البريد الإلكتروني"
                            type="email"
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
                                },
                            }}
                        />

                        {/* Verification Code Field */}
                        <TextField
                            fullWidth
                            label="كود التحقق"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            disabled={loading}
                            inputProps={{
                                maxLength: 6,
                                pattern: "[0-9]*",
                                inputMode: "numeric",
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PinIcon color="primary" />
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
                                },
                            }}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading || !email || !code}
                            startIcon={loading ? <CircularProgress size={20} /> : <VerifiedIcon />}
                            sx={{
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
                            {loading ? "جاري التحقق..." : "تحقق"}
                        </Button>

                        {/* Back to Login Link */}
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => navigate('/login')}
                            startIcon={<ArrowBackIcon />}
                            disabled={loading}
                            sx={{
                                mt: 1,
                                py: 1.2,
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
                            العودة لتسجيل الدخول
                        </Button>
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

export default Verify;