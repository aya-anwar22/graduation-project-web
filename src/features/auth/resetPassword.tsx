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
    useTheme,
    alpha,
    Alert,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../Student/services";
import EmailIcon from '@mui/icons-material/Email';
import PinIcon from '@mui/icons-material/Pin';
import LockIcon from '@mui/icons-material/Lock';
import LockResetIcon from '@mui/icons-material/LockReset';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const ResetPassword = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    // لإظهار/إخفاء كلمة المرور
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // التحقق من تطابق كلمة المرور
        if (newPassword !== confirmNewPassword) {
            setError("كلمة المرور غير متطابقة");
            return;
        }

        // التحقق من قوة كلمة المرور (اختياري)
        if (newPassword.length < 6) {
            setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const data = await resetPassword({ email, code, newPassword, confirmNewPassword });

            if ("error" in data) {
                setError(data.error || "فشل في إعادة تعيين كلمة المرور");
                console.log("Reset Password failed:", data.error);
                return;
            }

            setSuccess("تم إعادة تعيين كلمة المرور بنجاح! جاري إعادة التوجيه...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error: any) {
            setError(error.message || "حدث خطأ غير متوقع");
            console.log("Unexpected error:", error.message || error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleNewPassword = () => {
        setShowNewPassword((prev) => !prev);
    };

    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev);
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
                            استعادة كلمة المرور
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontSize: '1.1rem' }}
                        >
                            أدخل كود التحقق وكلمة المرور الجديدة
                        </Typography>
                    </Box>

                    {/* Success Message */}
                    {success && (
                        <Alert 
                            icon={<CheckCircleIcon fontSize="inherit" />}
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

                        {/* Verification Code Field */}
                        <TextField
                            fullWidth
                            label="كود الاستعادة"
                            margin="normal"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            disabled={loading || !!success}
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
                                    '&.Mui-focused': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 5px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                    },
                                },
                            }}
                        />

                        {/* New Password Field */}
                        <TextField
                            fullWidth
                            label="كلمة المرور الجديدة"
                            type={showNewPassword ? "text" : "password"}
                            margin="normal"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            disabled={loading || !!success}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="primary" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleToggleNewPassword} edge="end" disabled={loading || !!success}>
                                            {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            helperText="يجب أن تكون 6 أحرف على الأقل"
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

                        {/* Confirm New Password Field */}
                        <TextField
                            fullWidth
                            label="تأكيد كلمة المرور الجديدة"
                            type={showConfirmPassword ? "text" : "password"}
                            margin="normal"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                            disabled={loading || !!success}
                            error={!!error && error.includes("غير متطابقة")}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="primary" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleToggleConfirmPassword} edge="end" disabled={loading || !!success}>
                                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                            {loading ? "جاري إعادة التعيين..." : "إعادة تعيين كلمة المرور"}
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