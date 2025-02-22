import { FaWindows, FaPlaystation, FaXbox, FaApple, FaLinux, FaAndroid } from "react-icons/fa";
import { SiNintendoswitch, SiAtari, SiSega, SiAmazonlumberyard } from "react-icons/si";
import { BsGlobe } from "react-icons/bs";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const platformIcons = {
    "PC": <FaWindows />,
    "PS Vita": <FaPlaystation />,
    "PlayStation": <FaPlaystation />,
    "PlayStation 3": <FaPlaystation />,
    "PlayStation 4": <FaPlaystation />,
    "PlayStation 5": <FaPlaystation />,
    "Xbox": <FaXbox />,
    "Xbox 360": <FaXbox />,
    "Xbox One": <FaXbox />,
    "Xbox Series S/X": <FaXbox />,
    "Nintendo": <SiNintendoswitch />,
    "Nintendo 3DS": <SiNintendoswitch />,
    "Nintendo Switch": <SiNintendoswitch />,
    "Apple Macintosh": <FaApple />,
    "macOS": <FaApple />,
    "Linux": <FaLinux />,
    "Android": <FaAndroid />,
    "Web": <BsGlobe />,
    "Atari": <SiAtari />,
    "SEGA": <SiSega />,
    "Amazon Luna": <SiAmazonlumberyard />
};

export default function gameCard({ game, screenshots }) {
    return (
        <div className="card gameCard">
            <Swiper
                scrollbar={{
                    hide: true,
                }}
                modules={[Scrollbar]}
                className="mySwiper"
            >
                {game.short_screenshots.map((screenshot) => (
                    <SwiperSlide key={screenshot.id}>
                        <img src={screenshot.image} className="card-img-top" alt="..." />
                    </SwiperSlide>
                ))}
            </Swiper>
            <div>
                <div>
                    {game.parent_platforms.map((platform) => {
                        const platformName = platform.platform.name;
                        return (
                            <span className="me-2 consolleIcons" key={platform.platform.id}>
                                {platformIcons[platformName] || platformName}
                            </span>
                        );
                    })}
                </div>
                <h4 className="mt-1">{game.name} </h4>
            </div>
        </div>
    )
}