import React, { useEffect, useState } from "react";

const images = [
    "/banner1.png",
    "/banner2.png",
    "/banner3.png",
    "/banner4.png",
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