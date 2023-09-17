import React from 'react';
import {
  TelegramShareButton,
  WhatsappShareButton,
  EmailShareButton,
  PinterestShareButton,
  TwitterShareButton,
  TelegramIcon,
  WhatsappIcon,
  EmailIcon,
  PinterestIcon,
  TwitterIcon,
} from 'react-share';

export const ShareButtons = () => {
  const shareUrl = 'https://your-share-url.com';
  const title = 'Your Share Title';

  return (
    <div className="share-buttons">
      <TelegramShareButton url={shareUrl}>
        <TelegramIcon size={32} round />
      </TelegramShareButton>

      <WhatsappShareButton url={shareUrl} title={title}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>

      <EmailShareButton url={shareUrl} subject={title}>
        <EmailIcon size={32} round />
      </EmailShareButton>

      <PinterestShareButton url={shareUrl} media={`${shareUrl}/image-to-share.jpg`} description={title}>
        <PinterestIcon size={32} round />
      </PinterestShareButton>

      <TwitterShareButton url={shareUrl} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
    </div>
  );
};

