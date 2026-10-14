"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock3, MapPin } from "lucide-react";
import { Panel, Tag } from "./UI";
import { useYouth } from "./YouthProvider";

export function AppointmentCard() {
  return (
    <Panel title="الموعد المقبل" className="appointment-panel">
      <div className="appointment-info">
        <div className="date-tile">
          <span>الاثنين</span>
          <strong>19</strong>
          <span>أكتوبر</span>
        </div>
        <div>
          <Tag>توجيه</Tag>
          <h3>لنتحدث عن مشروعك</h3>
          <p>
            <Clock3 size={14} />
            <bdi dir="ltr">10:00 – 11:00</bdi>
          </p>
          <p>
            <MapPin size={14} />
            مكتب بداية، أكادير
          </p>
        </div>
      </div>
      <div className="mediator-mini">
        <Image
          src="/editorial/story-amina.webp"
          alt=""
          width={42}
          height={42}
        />
        <div>
          <b>إيمان رامي</b>
          <span>وسيطتك</span>
        </div>
        <span className="online-dot" />
      </div>
      <Link href="/neet/messages" className="button button-secondary">
        حضّر موعدي
        <ArrowRight size={15} />
      </Link>
    </Panel>
  );
}
const tasks = [
  "إتمام سيرتي الذاتية",
  "اكتشاف فرصتين",
  "الاستعداد للمقابلة",
  "مشاركة طموحاتي مع إيمان",
];
export function NextSteps() {
  const { completed, toggleCompleted } = useYouth();
  return (
    <Panel
      title="خطواتي الصغيرة المقبلة"
      note="حسب إيقاعك، خطوة بعد أخرى."
      href="/neet/micro-actions"
    >
      <div className="task-list">
        {tasks.map((task, id) => (
          <label
            key={task}
            className={`task-row ${completed.includes(id) ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              checked={completed.includes(id)}
              onChange={() => toggleCompleted(id)}
            />
            <span>{task}</span>
            {completed.includes(id) && <Check size={14} />}
          </label>
        ))}
      </div>
      <div className="progress-caption">
        <span>
          {completed.length} من {tasks.length} منجزة
        </span>
        <span>{Math.round((completed.length / tasks.length) * 100)}%</span>
      </div>
      <progress value={completed.length} max={tasks.length} />
    </Panel>
  );
}
