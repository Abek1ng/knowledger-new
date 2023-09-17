import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import questionImage from "public/question.svg";
import logoContainer from 'public/logoContainer.svg';
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';
import GridLoader from 'react-spinners/GridLoader';
import PropagateLoader from 'react-spinners/PropagateLoader'
import { creds } from '../../creds';

import {
  TelegramShareButton,
  WhatsappShareButton,
  EmailShareButton,
  TwitterShareButton,
  TelegramIcon,
  FacebookShareButton,
  FacebookIcon,
  WhatsappIcon,
  EmailIcon,
  TwitterIcon,
} from 'react-share';


const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [rightCount, setRightCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [quizId, setQuizId] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOption, setOption] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [duration, setDuration] = useState(0);
  const [imgData, setImageData] = useState(null);
  const [isReadyToShare, setIsReadyToShare] = useState(true);
  const [imageShareUrl, setUploadedImageUrl] = useState(null);
  const [correctQuestions, setCorrectQuestions] = useState([]);

  // Функция для создания скриншота и его загрузки
  // Делаем скриншот с помощью html2canvas и загружаем в супабейз
  const handleShare = async () => {
    setIsReadyToShare(false);
    const input = document.getElementById("result-div");

    html2canvas(input).then(async (canvas) => {
      canvas.toBlob(async (blob) => {
        const fileExtension = 'jpg';
        const fileName = `quiz-result-${uuidv4()}.${fileExtension}`;

        const { data, error } = await supabase.storage
          .from('my-bucket')
          .upload(fileName, blob, { contentType: 'image/jpg' });

        if (error) {
          console.error('Error uploading image:', error);
          return;
        }
        const publicUrl = `${creds.SUPABASE_URL}/storage/v1/object/public/my-bucket/${fileName}`;
        setUploadedImageUrl(publicUrl);
        setIsReadyToShare(true);

      }, 'image/jpg');
    });
  };


  useEffect(() => {
    fetchQuestions();
    fetchOptions();
  }, []);

  // Загрузка вопросов из базы данных
  async function fetchQuestions() {
    try {
      const { data: categories, error: categoryError } = await supabase
        .from('Category')
        .select('id');

      if (categoryError) {
        console.error('Error fetching categories:', categoryError);
        return;
      }

      const fetchedQuestions = [];

      for (const category of categories) {
        const { data, error } = await supabase
          .from('Question')
          .select('id')
          .eq('quiz_id', quizId)
          .eq('category_id', category.id);

        if (error) {
          console.error('Error fetching question IDs:', error);
          return;
        }
        // Здесь рандомно фетчим вопросы с каждой категории
        if (data && data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          const randomQuestionId = data[randomIndex].id;
          const { data: questionDetails, error: detailsError } = await supabase
            .from('Question')
            .select('id, title, quiz_id')
            .eq('id', randomQuestionId)
            .single();

          if (detailsError) {
            console.error('Error fetching question details:', detailsError);
            return;
          }

          if (questionDetails) {
            fetchedQuestions.push(questionDetails);
          }
        }
      }

      setQuestions(fetchedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }




  // Загрузка вариантов ответа из базы данных
  async function fetchOptions() {
    const { data, error } = await supabase
      .from('Option')
      .select('id, text, right, question_id');

    if (error) {
      console.error('Error fetching options:', error);
      return;
    }
    setOptions(data);
  };

  // Функция для выбора ответа на текущий вопрос
  function handleAnswerSelect(questionId, option) {
    setOption(option);
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: option.id,
    });
  };

  // Функция для перехода к следующему вопросу
  // Обновляем индекс текущего вопроса и подсчитываем правильные и неправильные ответы
  function handleNextQuestion() {
    setCurrentQuestionIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      const nextQuestionId = questions[newIndex]?.id;
      setOption(options.find(option => option.id === selectedAnswers[nextQuestionId]) || null);
      return newIndex;
    });

    if (selectedOption && selectedOption.right === true) {
      setRightCount(rightCount + 1);
    } else {
      setRightCount(rightCount + 1);
    }
  }

  // Функция для перехода к предыдущему вопросу
  // Обновляем индекс текущего вопроса и устанавливаем выбранный вариант ответа для этого вопроса
  function handlePreviousQuestion() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => {
        const newIndex = prevIndex - 1;
        const prevQuestionId = questions[newIndex]?.id;
        setOption(options.find(option => option.id === selectedAnswers[prevQuestionId]) || null);
        return newIndex;
      });
    }
  }

  // Функция для завершения квиза
  // Подсчитываем результаты и отправляем их в базу данных супабейза
  async function handleQuizSubmit() {
    let rightCount = 0;
    let wrongCount = 0;
    let newAnswers = [];
    Object.keys(selectedAnswers).forEach(questionId => {
      const selectedOptionId = selectedAnswers[questionId];
      const selectedOption = options.find(option => option.id === selectedOptionId);
      if (selectedOption && selectedOption.right === true) {
        rightCount++;
        newAnswers.push(true);
      } else {
        wrongCount++;
        newAnswers.push(false);
      }
    });

    // Обновляем 2д лист ответов, пологаясб на которые будем рисовать контейнер результата
    const updatedQuestions = [...correctQuestions, newAnswers];
    setCorrectQuestions(updatedQuestions);
    const endTime = new Date().getTime();
    const duration = endTime - startTime;
    setDuration(Math.floor(duration / 1000));
    setRightCount(rightCount);
    setWrongCount(wrongCount);

    const { data, error } = await supabase
      .from('QuizResult')
      .insert([
        {
          right: rightCount,
          wrong: wrongCount,
          duration: duration,
          quiz_id: quizId,
          ref_id: uuidv4(),
        },
      ]).select();

    if (error) {
      console.error('Error submitting quiz:', error);
      return;
    }
    // Отображаем результаты квиза
    setShowResult(true);
  }




  // @ts-ignore
  // @ts-ignore
  return (
    questions[currentQuestionIndex] && options ?
      <div>
        {showResult ? (
          <div className="flex flex-col items-center" style={{
            width: '100%'
          }}>
            <div id="result-div" className="grid-container">
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

            <p className="font-medium mt-3 text-black text-[16px]">
              {!isReadyToShare ? "Wait..." : "Share you result on:"}
            </p>
            {!isReadyToShare ?
              <div style={{ paddingTop: '20px' }}>
                <PropagateLoader color="#6A4FF5" />
              </div>
              :
              <div className="flex space-x-4 pt-3">
                <TelegramShareButton url={imageShareUrl}>
                  <TelegramIcon size={32} onClick={imageShareUrl ? undefined : handleShare} style={{ borderRadius: '7px' }} />
                </TelegramShareButton>
                <WhatsappShareButton url={imageShareUrl}>
                  <WhatsappIcon size={32} onClick={imageShareUrl ? undefined : handleShare} style={{ borderRadius: '7px' }} />
                </WhatsappShareButton>
                <EmailShareButton url={imageShareUrl}>
                  <EmailIcon size={32} onClick={imageShareUrl ? undefined : handleShare} style={{ borderRadius: '7px' }} />
                </EmailShareButton>
                <FacebookShareButton url={imageShareUrl}>
                  <FacebookIcon size={32} style={{ borderRadius: '7px' }} onClick={imageShareUrl ? undefined : handleShare} />
                </FacebookShareButton>
                <TwitterShareButton url={imageShareUrl}>
                  <TwitterIcon size={32} style={{ borderRadius: '7px' }} onClick={imageShareUrl ? undefined : handleShare} />
                </TwitterShareButton>
              </div>}

            <div className="w-full flex justify-between items-center mt-[50px]">
              <a
                href="https://knowledger.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-[16px] font-medium h-12 bg-[#6A4FF5] text-white flex justify-center items-center rounded-[12px]"
              >
                <button className="knowledger-button">
                  KNOWLEDGER.ORG
                </button>
              </a>
            </div>
            <div
              className="mt-[81px] space-x-6"
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'end'
              }}
            >
              <button
                className="flex w-[268px] h-[64px]  justify-center items-center gap-[10px] flex-shrink-0 rounded-[12px] border border-solid border-[1.5px] border-[#F2F2F2] bg-[#FFF] text-[#6A4FF5]"
                style={{
                  fontWeight: 600,
                  background: '#FFF'
                }}
              >
                Share
              </button>
              <button
                className="flex w-[268px] h-[64px] justify-center items-center gap-[10px] flex-shrink-0 rounded-[12px] text-white"
                style={{
                  fontWeight: 600,
                  background: '#6A4FF5'
                }}
              >
                Claim reward
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">

            <Image priority width={189} height={189} src={questionImage} alt="question" />
            <h2 className="w-full mt-10 max-w-[120px] rounded-full text-[#6A4FF5] bg-[#F0EDFE] flex justify-center items-center h-[36px] font-medium">
              {`Question ${currentQuestionIndex + 1}`}.
            </h2>

            <p className="text-center mt-3 md:text-[16px] md:ml-0 lg:ml-[14px] lg:text-[24px] text-[#414141] font-medium">
              {
                questions[currentQuestionIndex] ? questions[currentQuestionIndex].title : " "
              }
            </p>
            <ul className="grid grid-cols-2 gap-3 w-full mt-10" style={{ listStyleType: 'upper-roman' }}>
              {
                options.filter(option => option?.question_id === questions[currentQuestionIndex].id).map((option) => (
                  <li
                    className="md:text-[10px] lg:text-[16px] rounded-full text-[#6A4FF5] bg-[#F0EDFE] w-full max-w-35"
                    key={option?.id}
                    onClick={() => handleAnswerSelect(questions[currentQuestionIndex].id, option)}
                    style={{
                      background: selectedAnswers[questions[currentQuestionIndex].id] === option?.id ? '#6A4FF5' : '#F0EDFE',
                      color: selectedAnswers[questions[currentQuestionIndex].id] === option?.id ? '#FFF' : '#6A4FF5',
                      cursor: 'pointer',
                      fontWeight: 500,
                      padding: '24px 35px',
                      minHeight: '44px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: '16px',
                      overflow: 'hidden'
                    }}
                  >
                    {option.text}
                  </li>
                ))
              }
            </ul>
            <div
              className="mt-[50px]"
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'end'
              }}
            >
              {currentQuestionIndex > 0 && (
                <button
                  className="w-full h-12 text-[16px] text-white flex justify-center items-center rounded-[12px] mr-4"
                  style={{
                    fontWeight: 600,
                    background: '#6A4FF5'
                  }}
                  onClick={handlePreviousQuestion}
                >
                  Previous
                </button>
              )}
              {currentQuestionIndex === questions.length - 1 ? (
                selectedOption && (
                  <button
                    className="w-full h-12 text-[16px] text-white flex justify-center items-center rounded-[12px]"
                    style={{
                      fontWeight: 600,
                      background: '#6A4FF5'
                    }}
                    onClick={handleQuizSubmit}>
                    Finish
                  </button>
                )
              ) : (
                selectedOption && (
                  <button
                    className="w-full h-12 text-[16px] text-white flex justify-center items-center rounded-[12px]"
                    style={{
                      fontWeight: 600,
                      background: '#6A4FF5'
                    }}
                    onClick={handleNextQuestion}>
                    Next
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
      : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <GridLoader color="#6A4FF5" />
      </div>
  );
};

export default Quiz;