import React from 'react';
import logoContainer from 'public/logoContainer.svg';
import Image from 'next/image';


const ResultGrid = ({ correctQuestions }) => {
    return (
        <div className="flex justify-center mt-12 sm:mt-8 mb-[320px] sm:mb-[250px] sm:mt-[100px]">
            <div id="result-div" className="grid-container h-[320px] sm:h-[180px]">
                {Array.from({ length: 28 }, (_, index) => {
                    const column = index % 7;
                    const row = Math.floor(index / 7);
                    const isCorrect = correctQuestions[column] && correctQuestions[column][row];
                    return (
                        <div
                            key={index}
                            className={`grid-item ${isCorrect !== undefined ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
                        ></div>
                    );
                })}
                <div className="centered-image">
                    <Image src={logoContainer} alt="logoContainer" />
                </div>
            </div>
        </div>
    );
};


export default ResultGrid;
