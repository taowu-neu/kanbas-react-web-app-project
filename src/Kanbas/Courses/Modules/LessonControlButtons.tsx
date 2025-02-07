import { IoEllipsisVertical, IoAdd } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
export default function LessonControlButtons() {
  return (
    <div className="float-end">
      <GreenCheckmark />
      <IoAdd className="fs-4" />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}
