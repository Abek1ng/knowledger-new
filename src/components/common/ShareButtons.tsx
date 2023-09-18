import PropagateLoader from 'react-spinners/PropagateLoader'

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

export const ShareButtons = ({isReadyToShare, imageShareUrl, handleShare}) => {
    return (
      
      <div className={`${!isReadyToShare ? 'pt-5' : 'flex space-x-4 pt-3'} sm:space-x-2 sm:pt-2`}>
        {!isReadyToShare ?
          <div style={{ paddingTop: '20px' }}>
            <PropagateLoader color="#6A4FF5" />
          </div>
          :
          <div className="flex space-x-4 pt-3">
            <TelegramShareButton url={imageShareUrl} disabled={!isReadyToShare}>
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
          </div>
        }
      </div>
    );
};