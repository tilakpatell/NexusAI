// ParticlesBackground.jsx
import { useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useTheme } from './ThemeContext';

export function ParticlesBackground() {
  const { isDark } = useTheme();
  
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: -1
        },
        background: {
          color: {
            value: isDark ? "#000000" : "#ffffff",
          },
        },
        fpsLimit: 60,
        particles: {
          number: {
            value: 100,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: isDark ? "#ffffff" : "#000000",
          },
          shape: {
            type: ["circle", "triangle"],
            options: {
              triangle: {
                sides: 3
              }
            }
          },
          opacity: {
            value: isDark ? 0.3 : 0.2,
            random: false,
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
              sync: false
            }
          },
          size: {
            value: 3,
            random: {
              enable: true,
              minimumValue: 1
            },
            animation: {
              enable: true,
              speed: 2,
              minimumValue: 1,
              sync: false
            }
          },
          links: {
            enable: true,
            distance: 150,
            color: isDark ? "#ffffff" : "#000000",
            opacity: isDark ? 0.3 : 0.2,
            width: 1.5,
            triangles: {
              enable: true,
              opacity: isDark ? 0.1 : 0.05
            }
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            outModes: {
              default: "bounce",
              bottom: "bounce",
              left: "bounce",
              right: "bounce",
              top: "bounce"
            },
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detectsOn: "window",
          events: {
            onHover: {
              enable: true,
              mode: ["grab", "connect"]
            },
            onClick: {
              enable: true,
              mode: "push"
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 200,
              links: {
                opacity: 0.5,
                color: isDark ? "#ffffff" : "#000000"
              }
            },
            push: {
              quantity: 4
            },
            connect: {
              distance: 200,
              links: {
                opacity: 0.3
              },
              radius: 120
            }
          }
        },
        responsive: [
          {
            maxWidth: 768,
            options: {
              particles: {
                number: {
                  value: 50
                }
              }
            }
          }
        ]
      }}
    />
  );
}
