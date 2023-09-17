"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import Faq from "@/components/Faq";
import logoImage from "public/logo.svg";
const Header = () => {
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isMedalOpen, setIsMedalOpen] = useState(false);
  const [isSettings, setIsSettings] = useState(false);

  const openFaqModal = () => setIsFaqOpen(true);
  const closeFaqModal = () => setIsFaqOpen(false);

  const openLeaderBoard = () => setIsLeaderboardOpen(true);
  const closeLeaderboard = () => setIsLeaderboardOpen(false);

  const openMedal = () => setIsMedalOpen(true);
  const closeMedal = () => setIsMedalOpen(false);

  const openSettings = () => setIsSettings(true);
  const closeSettings = () => setIsSettings(false);
  return (
    <header
      className="md:bg-[#6A4FF5] md:text-[20px] md:text-white md:font-semibold md:justify-center"
      style={{
        display: "flex",
        alignItems: "center",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "1rem",
      }}
    >
      <p className="lg:hidden md:block">WIZ</p>
      <Link href="/">
        <Image
          className="lg:block md:hidden"
          src= {logoImage}
          alt="Logo"
          style={{ flexShrink: 0 }}
          width={275}
          height={50}
        />
      </Link>
      {/* <nav className="navigation">
       <ul style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', listStyleType: 'none' }}>
         <li style={{ marginLeft: '24px' }} onClick={openFaqModal}>
           <Image priority width={40} height={40} src="/faq.svg" alt="how to play" />
         </li>
         <li style={{ marginLeft: '24px' }} onClick={openLeaderBoard}>
           <Image priority width={40} height={40} src="/leaderboard.svg" alt="leaderboard" />
         </li>
         <li style={{ marginLeft: '24px' }} onClick={openMedal}>
           <Image priority width={40} height={40} src="/medal.svg" alt="medal" />
         </li>
         <li style={{ marginLeft: '24px' }} onClick={openSettings}>
           <Image priority width={40} height={40} src="/settings.svg" alt="settings" />
         </li>
       </ul>
      </nav> */}
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
      <Modal isOpen={isLeaderboardOpen} onClose={closeLeaderboard}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Leaderboard</ModalHeader>
          <ModalCloseButton />
          <ModalBody>leaderboard</ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isMedalOpen} onClose={closeMedal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Medal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>medal</ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isSettings} onClose={closeSettings}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>settings</ModalBody>
        </ModalContent>
      </Modal>
    </header>
  );
};

export default Header;
