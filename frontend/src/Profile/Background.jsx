import { useEffect, useRef } from 'react';
import { useTheme } from '../Home/ThemeContext';

export function Background() {
    const canvasRef = useRef(null);
    const timeRef = useRef(0);
    const { isDark } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let mousePosition = { x: 0, y: 0 };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e) => {
            mousePosition.x = e.clientX;
            mousePosition.y = e.clientY;
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.baseSize = Math.random() * 2 + 1;
                this.size = this.baseSize;
                this.speedX = Math.random() * 0.3 - 0.15;
                this.speedY = Math.random() * 0.3 - 0.15;
                this.alpha = Math.random() * 0.5 + 0.2;
                this.angleSpeed = Math.random() * 0.002 - 0.001;
                this.angle = Math.random() * Math.PI * 2;
            }

            update() {
                this.angle += this.angleSpeed;
                this.x += this.speedX + Math.sin(this.angle) * 0.5;
                this.y += this.speedY + Math.cos(this.angle) * 0.5;

                const dx = this.x - mousePosition.x;
                const dy = this.y - mousePosition.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;

                if (distance < maxDistance) {
                    const force = (1 - distance / maxDistance) * 0.02;
                    this.x += dx * force;
                    this.y += dy * force;
                    this.size = this.baseSize * (1 + (1 - distance / maxDistance));
                } else {
                    this.size = this.baseSize;
                }

                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = isDark
                                ? `rgba(255, 255, 255, ${this.alpha * 0.3})`
                                : `rgba(0, 0, 0, ${this.alpha * 0.2})`;
                ctx.fill();
            }
        }

        function init() {
            particles = [];
            const particleCount = Math.min((canvas.width * canvas.height) / 15000, 150);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function drawGradient() {
            const gradient = ctx.createRadialGradient(
                canvas.width / 2,
                canvas.height / 2,
                0,
                canvas.width / 2,
                canvas.height / 2,
                canvas.width / 2
            );

            if (isDark) {
                gradient.addColorStop(0, 'rgba(0, 102, 255, 0.1)');
                gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
                gradient.addColorStop(1, 'rgba(75, 0, 130, 0.1)');
            } else {
                gradient.addColorStop(0, 'rgba(230, 243, 255, 0.8)');
                gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
                gradient.addColorStop(1, 'rgba(240, 240, 255, 0.8)');
            }

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            timeRef.current += 0.005;

            drawGradient();

            particles.forEach((particle, index) => {
                particle.update();
                particle.draw();

                for (let j = index + 1; j < particles.length; j++) {
                    const dx = particle.x - particles[j].x;
                    const dy = particle.y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = isDark
                                          ? `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`
                                          : `rgba(0, 0, 0, ${0.05 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        }

        init();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isDark]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10"
            style={{
                background: isDark ? '#000' : '#fff',
                transition: 'background-color 0.3s ease'
            }}
        />
    );
}