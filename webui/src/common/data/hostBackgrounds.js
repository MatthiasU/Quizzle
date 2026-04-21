import classroom from "@/common/assets/host-backgrounds/classroom.jpg";
import library from "@/common/assets/host-backgrounds/library.jpg";
import stadium from "@/common/assets/host-backgrounds/stadium.jpg";
import space from "@/common/assets/host-backgrounds/space.jpg";
import beach from "@/common/assets/host-backgrounds/beach.jpg";
import studio from "@/common/assets/host-backgrounds/studio.jpg";

export const HOST_BACKGROUNDS = [
    {id: "classroom", label: "Klassenzimmer", image: classroom},
    {id: "library", label: "Bibliothek", image: library},
    {id: "stadium", label: "Stadion", image: stadium},
    {id: "space", label: "Weltraum", image: space},
    {id: "beach", label: "Strand", image: beach},
    {id: "studio", label: "Studio", image: studio}
];

export const DEFAULT_HOST_BACKGROUND = HOST_BACKGROUNDS[0].id;

export const getHostBackground = (id) =>
    HOST_BACKGROUNDS.find(b => b.id === id) || HOST_BACKGROUNDS[0];
