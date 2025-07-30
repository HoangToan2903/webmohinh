import React, { useEffect, useState } from "react";

const images = [
    "https://danfigure.vn/wp-content/uploads/2024/11/banner-211-%C3%97-62-cm-1200-%C3%97-518-px.png",
    "https://danfigure.vn/wp-content/uploads/2024/11/banner-211-%C3%97-62-cm-1200-%C3%97-518-px-1.png",
    "https://file.hstatic.net/200000838897/article/gk-figure-banner_5cfd73eb18ae47899865e6a695ac6d1d.jpg",
    "https://theme.hstatic.net/200000838897/1001313362/14/categorybanner_2_img.jpg?v=75",
];

function Banner() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="slider-container">
            {images.map((img, index) => (
                <img
                    key={index}
                    src={img}
                    alt={`Slide ${index}`}
                    className={`slider-image ${index === currentIndex ? "active" : ""}`}
                />
            ))}
        </div>
    )
}
export default Banner;