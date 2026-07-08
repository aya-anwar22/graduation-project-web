import { useState, useEffect, useCallback, useMemo } from "react";
import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    FormHelperText,
    CircularProgress,
    Alert,
    InputAdornment,
    IconButton,
    Divider,
    useTheme,
    alpha,
    Stepper,
    Step,
    StepLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { singUp } from "../Student/services";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LoginIcon from '@mui/icons-material/Login';

const API_BASE_URL = 'http://localhost:3000/api/v1';

interface University {
    id: string;
    name: string;
}

interface Department {
    id: string;
    name: string;
    universityId: string;
}

interface SignUpRequest {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    departmentId: string;
    universityId: string;
    universityCode: string;
    phoneNumber: string;

}

export const SingUpForm = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    // البيانات الأساسية
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [universityCode, setUniversityCode] = useState("");

    // البيانات الإضافية
    const [universityId, setUniversityId] = useState("");
    const [departmentId, setDepartmentId] = useState("");

    // حالات التحميل والخطأ
    const [loading, setLoading] = useState(false);
    const [loadingUniversities, setLoadingUniversities] = useState(true);
    const [loadingDepartments, setLoadingDepartments] = useState(true);
    const [passwordError, setPasswordError] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // بيانات الجامعات والأقسام
    const [universities, setUniversities] = useState<University[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);

    // Active step للـ Stepper
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['المعلومات الشخصية', 'المعلومات الأكاديمية', 'كلمة المرور'];

    // جلب الجامعات من API - مرة واحدة فقط
    useEffect(() => {
        let isMounted = true;

        const fetchUniversities = async () => {
            try {
                setLoadingUniversities(true);
                const response = await fetch(`${API_BASE_URL}/universities`);

                if (!response.ok) {
                    throw new Error('فشل في جلب الجامعات');
                }
                const result = await response.json();

                if (result.success && result.data && isMounted) {
                    const transformedData = result.data.map((item: any) => ({
                        id: item._id,
                        name: item.universityName
                    }));
                    setUniversities(transformedData);
                }
            } catch (error) {
                console.error('Error fetching universities:', error);
                if (isMounted) {
                    setError('فشل في تحميل قائمة الجامعات');
                }
            } finally {
                if (isMounted) {
                    setLoadingUniversities(false);
                }
            }
        };

        fetchUniversities();

        return () => {
            isMounted = false;
        };
    }, []); // ✅ مصفوفة فارغة - تنفذ مرة واحدة فقط

    // جلب الأقسام من API - مرة واحدة فقط
    useEffect(() => {
        let isMounted = true;

        const fetchDepartments = async () => {
            try {
                setLoadingDepartments(true);
                const response = await fetch(`${API_BASE_URL}/departments`);

                if (!response.ok) {
                    throw new Error('فشل في جلب الأقسام');
                }
                const result = await response.json();

                if (result.success && result.data && isMounted) {
                    const transformedData = result.data.map((item: any) => ({
                        id: item._id,
                        name: item.departmentName,
                        universityId: item.universityId?._id || item.universityId
                    }));
                    setDepartments(transformedData);
                }
            } catch (error) {
                console.error('Error fetching departments:', error);
                if (isMounted) {
                    setError('فشل في تحميل قائمة الأقسام');
                }
            } finally {
                if (isMounted) {
                    setLoadingDepartments(false);
                }
            }
        };

        fetchDepartments();

        return () => {
            isMounted = false;
        };
    }, []); // ✅ مصفوفة فارغة - تنفذ مرة واحدة فقط

    // فلترة الأقسام - تستخدم useMemo لمنع إعادة الحساب غير الضرورية
    const filteredDepartments = useMemo(() =>
        departments.filter(dept => dept.universityId === universityId),
        [departments, universityId]
    );

    // التحقق من تطابق كلمة المرور
    const validatePasswords = useCallback(() => {
        if (password !== confirmPassword) {
            setPasswordError("كلمة المرور غير متطابقة");
            return false;
        }
        setPasswordError("");
        return true;
    }, [password, confirmPassword]);

    // التحقق من صحة الخطوة الحالية
    const validateStep = useCallback(() => {
        if (activeStep === 0) {
            return fullName.trim() !== "" && email.trim() !== "" && phoneNumber.trim() !== "";
        } else if (activeStep === 1) {
            return universityId !== "" && departmentId !== "" && universityCode.trim() !== "";
        } else {
            return password.trim() !== "" && confirmPassword.trim() !== "" && password === confirmPassword;
        }
    }, [activeStep, fullName, email, phoneNumber, universityId, departmentId, universityCode, password, confirmPassword]);

    const handleNext = useCallback(() => {
        if (validateStep()) {
            setActiveStep((prev) => prev + 1);
        }
    }, [validateStep]);

    const handleBack = useCallback(() => {
        setActiveStep((prev) => prev - 1);
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setPasswordError("كلمة المرور غير متطابقة");
            return;
        }

        if (!universityId || !departmentId || !universityCode) {
            setError("الرجاء إكمال جميع الحقول");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const signUpData: SignUpRequest = {
                fullName,
                email,
                password,
                confirmPassword,
                departmentId,
                universityId,
                universityCode,
                phoneNumber,
            };

            console.log("بيانات التسجيل:", signUpData);

            const data = await singUp(signUpData);

            if ("error" in data) {
                setError(data.error || "فشل التسجيل");
                return;
            }

            navigate("/verify");
        } catch (error: any) {
            setError(error.message || "حدث خطأ غير متوقع");
        } finally {
            setLoading(false);
        }
    }, [fullName, email, password, departmentId, universityId, universityCode, phoneNumber, navigate, confirmPassword]);

    const handleTogglePassword = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const handleToggleConfirmPassword = useCallback(() => {
        setShowConfirmPassword((prev) => !prev);
    }, []);

    return (
        <Container maxWidth="md">
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
                            إنشاء حساب جديد
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontSize: '1.1rem' }}
                        >
                            انضم إلينا وابدأ رحلتك التعليمية
                        </Typography>
                    </Box>

                    {/* Stepper */}
                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

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
                        {/* Step 1: Personal Information */}
                        {activeStep === 0 && (
                            <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    المعلومات الشخصية
                                </Typography>

                                <TextField
                                    fullWidth
                                    label="الاسم الكامل"
                                    margin="normal"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon color="primary" />
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

                                <TextField
                                    fullWidth
                                    label="البريد الإلكتروني"
                                    type="email"
                                    margin="normal"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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

                                <TextField
                                    fullWidth
                                    label="رقم الهاتف"
                                    margin="normal"
                                    required
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PhoneIcon color="primary" />
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
                            </Box>
                        )}

                        {/* Step 2: Academic Information */}
                        {activeStep === 1 && (
                            <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    المعلومات الأكاديمية
                                </Typography>

                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel>الجامعة</InputLabel>
                                    <Select
                                        value={universityId || ""}
                                        label="الجامعة"
                                        onChange={(e) => {
                                            setUniversityId(e.target.value);
                                            setDepartmentId("");
                                        }}
                                        disabled={loadingUniversities}
                                        sx={{
                                            borderRadius: 2,
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 5px 15px ${alpha(theme.palette.primary.main, 0.2)}`,
                                            },
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>{loadingUniversities ? "جاري التحميل..." : "اختر جامعة"}</em>
                                        </MenuItem>
                                        {!loadingUniversities && universities.map((uni) => (
                                            <MenuItem key={uni.id} value={uni.id}>
                                                {uni.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>اختر جامعتك</FormHelperText>
                                </FormControl>

                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel>القسم</InputLabel>
                                    <Select
                                        value={departmentId || ""}
                                        label="القسم"
                                        onChange={(e) => setDepartmentId(e.target.value)}
                                        disabled={loadingDepartments || !universityId || filteredDepartments.length === 0}
                                        sx={{
                                            borderRadius: 2,
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 5px 15px ${alpha(theme.palette.primary.main, 0.2)}`,
                                            },
                                        }}
                                    >
                                        {!universityId ? (
                                            <MenuItem disabled value="">
                                                <em>اختر الجامعة أولاً</em>
                                            </MenuItem>
                                        ) : loadingDepartments ? (
                                            <MenuItem disabled value="">
                                                <CircularProgress size={20} /> جاري التحميل...
                                            </MenuItem>
                                        ) : filteredDepartments.length === 0 ? (
                                            <MenuItem disabled value="">
                                                <em>لا توجد أقسام لهذه الجامعة</em>
                                            </MenuItem>
                                        ) : (
                                            filteredDepartments.map((dept) => (
                                                <MenuItem key={dept.id} value={dept.id}>
                                                    {dept.name}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                    <FormHelperText>
                                        {!universityId
                                            ? 'اختر الجامعة أولاً'
                                            : filteredDepartments.length === 0
                                                ? 'لا توجد أقسام متاحة'
                                                : 'اختر قسمك'}
                                    </FormHelperText>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="الرقم الجامعي"
                                    margin="normal"
                                    required
                                    value={universityCode}
                                    onChange={(e) => setUniversityCode(e.target.value)}
                                    helperText="الرقم الخاص بك في الجامعة"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <BadgeIcon color="primary" />
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
                            </Box>
                        )}

                        {/* Step 3: Password */}
                        {activeStep === 2 && (
                            <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    كلمة المرور
                                </Typography>

                                <TextField
                                    fullWidth
                                    label="كلمة المرور"
                                    type={showPassword ? "text" : "password"}
                                    margin="normal"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleTogglePassword} edge="end">
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
                                        },
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="تأكيد كلمة المرور"
                                    type={showConfirmPassword ? "text" : "password"}
                                    margin="normal"
                                    required
                                    error={!!passwordError}
                                    helperText={passwordError}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleToggleConfirmPassword} edge="end">
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
                                        },
                                    }}
                                />
                            </Box>
                        )}

                        {/* Navigation Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={handleBack}
                                disabled={activeStep === 0 || loading}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.2,
                                    px: 3,
                                }}
                            >
                                السابق
                            </Button>

                            {activeStep === steps.length - 1 ? (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading || !validateStep()}
                                    startIcon={loading ? <CircularProgress size={20} /> : <HowToRegIcon />}
                                    sx={{
                                        borderRadius: 2,
                                        py: 1.2,
                                        px: 4,
                                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
                                        },
                                    }}
                                >
                                    {loading ? "جاري التسجيل..." : "تسجيل"}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={!validateStep()}
                                    sx={{
                                        borderRadius: 2,
                                        py: 1.2,
                                        px: 4,
                                    }}
                                >
                                    التالي
                                </Button>
                            )}
                        </Box>

                        <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                أو
                            </Typography>
                        </Divider>

                        {/* Login Link */}
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => navigate("/login")}
                            startIcon={<LoginIcon />}
                            sx={{
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
                            لديك حساب بالفعل؟ تسجيل الدخول
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