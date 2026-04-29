import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useGlobalScrollFade = () => {
    const location = useLocation();

    useEffect(() => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());

        const timer = setTimeout(() => {
            const elements = document.querySelectorAll(`
                .card, 
                .admin-table-card, 
                .auth-left-content,
                .auth-form-wrapper,
                .food-card,
                .menu-header,
                .admin-page-header,
                .gsap-fade
            `);

            elements.forEach((el) => {
                if (el.classList.contains("gsap-applied")) return;
                el.classList.add("gsap-applied");

            gsap.fromTo(
                el,
                {
                    opacity: 0,
                    y: 40,
                    scale: 0.98
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                    trigger: el,
                    start: "top 92%",
                    toggleActions: "play none none none",
                    once: true
                    }
                }
            );
            });

            ScrollTrigger.refresh();
        }, 150);

        return () => {
            clearTimeout(timer);
        };
    }, [location.pathname]);
};

export default useGlobalScrollFade;
