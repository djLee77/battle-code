import ListCard from "../components/ui/list-card";
import { Room } from "../types";

export default function RoomList() {
  const roomList: Room[] = [
    {
      id: 1,
      title: "1ㄷ1 뜨실 초보만",
      members: "1/2",
      isWait: true,
      password: null,
      settings: [
        {
          difficulty: "브론즈1",
          timeLimit: "1h",
          numOfSubmissions: 5,
          lang: "JAVA",
        },
      ],
    },
    {
      id: 2,
      title: "1ㄷ1 뜨실 초보만",
      members: "3/3",
      isWait: false,
      password: null,
      settings: [
        {
          difficulty: "브론즈1",
          timeLimit: "1h",
          numOfSubmissions: 5,
          lang: "JAVA",
        },
      ],
    },
  ];
  return (
    <div>
      <div>
        {roomList.map((room: Room) => (
          <ListCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
