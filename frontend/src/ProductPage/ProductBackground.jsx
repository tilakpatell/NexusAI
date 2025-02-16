import { useEffect, useRef } from 'react';
import { useTheme } from '../Home/ThemeContext';

function Background() {
    const canvasRef = useRef(null);
    const timeRef = useRef(0);
    const { isDark } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let mousePosition = { x: 0, y: 0 };
        let hueRotation = 0;

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
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.3 - 0.15;
                this.speedY = Math.random() * 0.3 - 0.15;
                this.alpha = Math.random() * 0.5 + 0.2;
                this.targetAlpha = this.alpha;
                this.pulseSpeed = Math.random() * 0.02 + 0.01;
                this.angle = Math.random() * Math.PI * 2;
                this.angleSpeed = (Math.random() - 0.5) * 0.002;
                this.glowSize = this.size * 2;
                this.hue = Math.random() * 60 - 30;
            }

            update() {
                // Orbital motion
                this.angle += this.angleSpeed;
                this.x += this.speedX + Math.sin(this.angle) * 0.5;
                this.y += this.speedY + Math.cos(this.angle) * 0.5;

                // Pulsing effect
                this.alpha += (this.targetAlpha - this.alpha) * 0.1;
                if (Math.random() < 0.01) {
                    this.targetAlpha = Math.random() * 0.5 + 0.2;
                }

                // Mouse interaction with smooth transition
                const dx = this.x - mousePosition.x;
                const dy = this.y - mousePosition.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 200;

                if (distance < maxDistance) {
                    const force = (1 - distance / maxDistance) * 0.05;
                    this.speedX += dx * force;
                    this.speedY += dy * force;
                    this.glowSize = this.size * (3 - distance / maxDistance);
                } else {
                    this.glowSize = this.size * 2;
                }

                // Apply speed dampening
                this.speedX *= 0.99;
                this.speedY *= 0.99;

                // Reset if out of bounds
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                // Glowing effect
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.glowSize
                );

                const baseColor = isDark ?
                                  `hsla(${210 + this.hue + hueRotation}, 100%, 70%, ${this.alpha})` :
                                  `hsla(${210 + this.hue + hueRotation}, 80%, 50%, ${this.alpha})`;

                gradient.addColorStop(0, baseColor);
                gradient.addColorStop(1, `hsla(${210 + this.hue + hueRotation}, 100%, 50%, 0)`);

                ctx.beginPath();
                ctx.fillStyle = gradient;
                ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            particles = [];
            const particleCount = Math.min((canvas.width * canvas.height) / 8000, 300);
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
                canvas.width
            );

            if (isDark) {
                gradient.addColorStop(0, 'rgba(0, 102, 255, 0.15)');
                gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
                gradient.addColorStop(1, 'rgba(75, 0, 130, 0.15)');
            } else {
                gradient.addColorStop(0, 'rgba(230, 243, 255, 0.9)');
                gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
                gradient.addColorStop(1, 'rgba(240, 240, 255, 0.9)');
            }

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            timeRef.current += 0.005;
            hueRotation = Math.sin(timeRef.current * 0.1) * 30;

            drawGradient();

            particles.forEach((particle, index) => {
                particle.update();
                particle.draw();

                // Enhanced particle connections
                for (let j = index + 1; j < particles.length; j++) {
                    const dx = particle.x - particles[j].x;
                    const dy = particle.y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        const opacity = (1 - distance / 150) * 0.2;
                        const gradient = ctx.createLinearGradient(
                            particle.x, particle.y, particles[j].x, particles[j].y
                        );

                        const color1 = isDark ?
                                       `hsla(${210 + particle.hue + hueRotation}, 100%, 70%, ${opacity})` :
                                       `hsla(${210 + particle.hue + hueRotation}, 80%, 50%, ${opacity})`;
                        const color2 = isDark ?
                                       `hsla(${210 + particles[j].hue + hueRotation}, 100%, 70%, ${opacity})` :
                                       `hsla(${210 + particles[j].hue + hueRotation}, 80%, 50%, ${opacity})`;

                        gradient.addColorStop(0, color1);
                        gradient.addColorStop(1, color2);

                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = (1 - distance / 150) * 2;
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

export default Background;