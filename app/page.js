"use client";

import { useState, useEffect } from "react";

export default function Home() {
    const [clickedDivs, setClickedDivs] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        // Load the state from localStorage when the component mounts
        const savedClickedDivs = localStorage.getItem("clickedDivs");
        if (savedClickedDivs) {
            setClickedDivs(JSON.parse(savedClickedDivs));
        }

        // Set the end time if it doesn't exist in localStorage
        let endTime = localStorage.getItem("endTime");
        if (!endTime) {
            endTime = new Date().getTime() + 365 * 24 * 60 * 60 * 1000; // 365 days from now
            localStorage.setItem("endTime", endTime);
        }

        // Calculate the remaining time
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const distance = endTime - now;
            return distance > 0 ? distance / 1000 : 0;
        };

        setTimeLeft(calculateTimeLeft());

        // Countdown timer
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleClick = (index) => {
        if (!clickedDivs.includes(index)) {
            const newClickedDivs = [...clickedDivs, index];
            setClickedDivs(newClickedDivs);

            // Save the state to localStorage
            localStorage.setItem("clickedDivs", JSON.stringify(newClickedDivs));
        }
    };

    const handleClearMemory = () => {
        setClickedDivs([]);
        localStorage.removeItem("clickedDivs");
        localStorage.removeItem("endTime");
        setTimeLeft(365 * 24 * 60 * 60); // Reset to 365 days
    };

    const formatTime = (seconds) => {
        const days = Math.floor(seconds / (24 * 60 * 60));
        const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((seconds % (60 * 60)) / 60);
        const secs = Math.floor(seconds % 60); // Use Math.floor to ensure seconds are an integer
        return `${days}d ${hours}h ${minutes}m ${secs}s`;
    };

    const formatDate = (index) => {
        const startDate = new Date();
        const resultDate = new Date(startDate);
        resultDate.setDate(startDate.getDate() + index);
        return resultDate.toDateString();
    };

    const divs = Array.from({ length: 365 }, (_, index) => (
        <div
            key={index}
            className={`grid-item border-2 cursor-pointer h-6 w-6 border-slate-300 ${
                clickedDivs.includes(index) ? "bg-green-500" : ""
            }`}
            onClick={() => handleClick(index)}
            title={formatDate(index-2)}
        ></div>
    ));

    return (
        <section className="h-screen flex flex-col justify-center items-center ">
            <header className="fixed top-0 w-full flex items-center justify-center bg-blue-500 p-4 shadow-lg rounded-b-lg">
                <h1 className="text-white text-2xl font-bold">
                    365 Days Challenge
                </h1>
            </header>
            <div className="container grid grid-cols-[repeat(30,1.5rem)] grid-rows-[repeat(13,1.5rem)] items-center justify-center mt-20">
                {divs}
            </div>
            <div className="mt-4 text-xl">
                Time Left: {formatTime(timeLeft)}
            </div>
            {/* <button
                onClick={handleClearMemory}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
                Reset
            </button> */}
        </section>
    );
}
