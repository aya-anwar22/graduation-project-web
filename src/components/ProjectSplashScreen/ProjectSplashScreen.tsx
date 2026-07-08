// components/SimpleProjectSplash.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Typography,
    alpha,
    Avatar,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';

interface SimpleProjectSplashProps {
    onFinish?: () => void;
    duration?: number;
    logo?: string;
}

const SimpleProjectSplash: React.FC<SimpleProjectSplashProps> = ({ 
    onFinish, 
    duration = 3000,
    logo 
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(0);

    // نحسب القيم العشوائية للجزيئات مرة واحدة فقط، مش في كل render،
    // عشان Math.random() function غير نقية (impure) ومينفعش تتنادى أثناء الـ render.
    const particles = useMemo(
        () =>
            [...Array(10)].map((_, i) => ({
                size: 10 + i * 3,
                color: ['#1e3c72', '#2a5298', '#4b79a1', '#6ab0e6', '#87CEEB'][i % 5],
                opacityBase: 0.1 + i * 0.02,
                left: Math.random() * 100,
                top: Math.random() * 100,
                translateX: Math.random() * 200 - 100,
                translateY: Math.random() * 200 - 100,
                duration: 8 + i,
            })),
        []
    );

    useEffect(() => {
        // محاكاة التقدم
        const progressTimer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressTimer);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);

        // إخفاء الشاشة
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
            if (onFinish) onFinish();
        }, duration);

        return () => {
            clearInterval(progressTimer);
            clearTimeout(hideTimer);
        };
    }, [duration, onFinish]);

    if (!isVisible) return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4b79a1 100%)',
                animation: 'fadeOut 0.5s ease-in-out forwards',
                animationDelay: `${duration - 500}ms`,
                '@keyframes fadeOut': {
                    '0%': { opacity: 1 },
                    '100%': { opacity: 0, visibility: 'hidden' },
                },
            }}
        >
            <Box sx={{ textAlign: 'center', color: 'white', maxWidth: '90%' }}>
                {/* اللوجو مع تأثير متوهج */}
                <Box
                    sx={{
                        width: 140,
                        height: 140,
                        margin: '0 auto 20px',
                        background: alpha('#fff', 0.15),
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `3px solid ${alpha('#fff', 0.4)}`,
                        boxShadow: '0 0 30px rgba(30, 60, 114, 0.5), 0 0 60px rgba(42, 82, 152, 0.3)',
                        animation: 'pulse 2s ease-in-out infinite, float 3s ease-in-out infinite',
                        '@keyframes pulse': {
                            '0%': { 
                                transform: 'scale(1)', 
                                boxShadow: '0 0 30px rgba(30, 60, 114, 0.5), 0 0 60px rgba(42, 82, 152, 0.3)',
                                borderColor: alpha('#fff', 0.4)
                            },
                            '50%': { 
                                transform: 'scale(1.08)', 
                                boxShadow: '0 0 50px rgba(30, 60, 114, 0.8), 0 0 80px rgba(42, 82, 152, 0.5)',
                                borderColor: alpha('#fff', 0.8)
                            },
                            '100%': { 
                                transform: 'scale(1)', 
                                boxShadow: '0 0 30px rgba(30, 60, 114, 0.5), 0 0 60px rgba(42, 82, 152, 0.3)',
                                borderColor: alpha('#fff', 0.4)
                            },
                        },
                        '@keyframes float': {
                            '0%, 100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-10px)' },
                        },
                    }}
                >
                    {logo ? (
                        <Avatar 
                            src={logo} 
                            sx={{ 
                                width: 90, 
                                height: 90,
                                border: '2px solid rgba(255,255,255,0.5)',
                                boxShadow: '0 0 20px rgba(255,255,255,0.3)',
                            }} 
                        />
                    ) : (
                        <AssignmentIcon sx={{ fontSize: 70, filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }} />
                    )}
                </Box>

                {/* اسم المنصة */}
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 800,
                        mb: 1,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.3)',
                        fontSize: { xs: '2.2rem', sm: '3rem' },
                        letterSpacing: '2px',
                    }}
                >
                    منصة<span style={{ fontWeight: 300 }}>المشاريع</span>
                </Typography>

                {/* شعار متحرك */}
                <Typography
                    variant="h6"
                    sx={{
                        mb: 4,
                        opacity: 0.95,
                        fontSize: { xs: '1rem', sm: '1.2rem' },
                        fontWeight: 400,
                        fontStyle: 'italic',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                        animation: 'fadeText 2s ease-in-out infinite',
                        '@keyframes fadeText': {
                            '0%, 100%': { opacity: 0.9, transform: 'scale(1)' },
                            '50%': { opacity: 1, transform: 'scale(1.02)' },
                        },
                    }}
                >
                    حيث تتحول الأفكار إلى مشاريع
                </Typography>

                {/* شريط التقدم بتدرج أزرق */}
                <Box sx={{ width: '100%', maxWidth: 320, mx: 'auto', mb: 2 }}>
                    <Box
                        sx={{
                            height: 6,
                            background: alpha('#fff', 0.2),
                            borderRadius: 3,
                            overflow: 'hidden',
                            backdropFilter: 'blur(5px)',
                            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
                        }}
                    >
                        <Box
                            sx={{
                                height: '100%',
                                width: `${progress}%`,
                                background: 'linear-gradient(90deg, #1e3c72, #2a5298, #4b79a1, #6ab0e6)',
                                borderRadius: 3,
                                transition: 'width 0.3s ease',
                                boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                            }}
                        />
                    </Box>
                </Box>

                {/* نص التقدم مع أيقونة */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            opacity: 0.9, 
                            fontSize: '0.95rem',
                            animation: 'pulse 1.5s ease-in-out infinite',
                        }}
                    >
                        جاري التحميل
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {[0, 1, 2].map((i) => (
                            <Box
                                key={i}
                                sx={{
                                    width: 4,
                                    height: 4,
                                    borderRadius: '50%',
                                    background: 'white',
                                    animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
                                    '@keyframes bounce': {
                                        '0%, 100%': { transform: 'translateY(0)' },
                                        '50%': { transform: 'translateY(-5px)' },
                                    },
                                }}
                            />
                        ))}
                    </Box>
                </Box>

                {/* نسبة التقدم */}
                <Typography 
                    variant="caption" 
                    sx={{ 
                        display: 'block', 
                        mt: 1, 
                        opacity: 0.7,
                        fontSize: '0.9rem',
                    }}
                >
                    {progress}%
                </Typography>

                {/* أيقونات صغيرة متحركة في الخلفية - كلها درجات أزرق */}
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    {particles.map((p, i) => (
                        <Box
                            key={i}
                            sx={{
                                position: 'absolute',
                                width: p.size,
                                height: p.size,
                                borderRadius: '50%',
                                background: alpha(p.color, p.opacityBase),
                                left: `${p.left}%`,
                                top: `${p.top}%`,
                                animation: `float${i} ${p.duration}s linear infinite`,
                                [`@keyframes float${i}`]: {
                                    '0%': { 
                                        transform: 'translate(0, 0) rotate(0deg)',
                                        opacity: 0.1,
                                    },
                                    '100%': { 
                                        transform: `translate(${p.translateX}px, ${p.translateY}px) rotate(${360 * (i + 1)}deg)`,
                                        opacity: 0.3,
                                    },
                                },
                            }}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default SimpleProjectSplash;