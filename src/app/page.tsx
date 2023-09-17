"use client";

import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Faq from "@/components/Faq";
import Quiz from "@/components/Quiz";
import Image from "next/image";
import logoSmallImage from "../../public/logoSmall.svg";
export default function Home() {
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const openFaqModal = () => setIsFaqOpen(true);
  const closeFaqModal = () => setIsFaqOpen(false);

  const openAuthModal = () => setIsAuthOpen(true);
  const closeAuthModal = () => setIsAuthOpen(false);

  const openQuiz = async () => {
    setIsQuizOpen(true);
  };

  return (
    <main className="flex min-h-screen flex-col lg:justify-center items-center p-6">
      {isQuizOpen ? (
        <Quiz />
      ) : (
        <>
          <Image
            priority
            width={159}
            height={159}
            src={logoSmallImage}
            alt="logo"
          />
          <h1
            className="md:text-center text-[32px]"
            style={{
              color: "#000",
              fontWeight: 600,
              lineHeight: "19px",
              marginBottom: "24px",
            }}
          >
            Start WIZ!
          </h1>
          <p className="text-[#414141] max-w-[500px] text-center text-[16px] font-medium">
            Remember that quizzes serve not only as an assessment, but also help
            you deepen your knowledge in a particular area.
          </p>
          <button
            className="w-full mt-6 max-w-[300px] text-[#186ADE] h-[36px] p-4 flex items-center justify-center rounded-full bg-[#E8F0FC]"
            onClick={openFaqModal}
          >
            Rules
          </button>
          <div className="flex flex-col lg:justify-center lg:items-center lg:max-w-[500px] mt-6">
            <p className="text-[#6A4FF5] text-[16px] font-semibold">
              Analyze answers:
            </p>
            <p className="text-[#414141] text-[14px] lg:text-center font-medium">
              Consider all options before choosing an answer. Sometimes the
              right answer may not be so obvious
            </p>
          </div>
          <div className="flex flex-col lg:justify-center lg:items-center lg:max-w-[500px] mt-3">
            <p className="text-[#6A4FF5] text-[16px] font-semibold">
              Manage time:
            </p>
            <p className="text-[#414141] lg:text-center text-[14px] font-medium">
              Quiz has a limited time, only{" "}
              <span className="text-[#6A4FF5] font-semibold">00:00 min.</span>{" "}
              Divide it between questions depending on the difficulty and length
              of the answers
            </p>
          </div>
          <button
            className="w-full max-w-[216px] h-[48px] flex justify-center items-center bg-[#6A4FF5] rounded-[12px] font-medium mt-12 text-white"
            onClick={openQuiz}
          >
            Start
          </button>
        </>
      )}
      <Modal isOpen={isFaqOpen} onClose={closeFaqModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How to Play?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Faq />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isAuthOpen} onClose={closeAuthModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Faq />
          </ModalBody>
        </ModalContent>
      </Modal>
    </main>
  );
}
