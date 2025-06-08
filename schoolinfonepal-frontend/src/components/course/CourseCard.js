"use client";
import React from "react";
import Link from "next/link";

const CourseCard = ({ course, onInquire }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-2 border border-gray-100">
    <div>
      {course.slug ? (
        <Link
          href={`/course/${course.slug}`}
          className="text-lg font-bold text-blue-800 hover:underline transition"
        >
          {course.name}
        </Link>
      ) : (
        <h3 className="text-lg font-bold text-blue-800">{course.name}</h3>
      )}
      <p className="text-sm text-gray-600">
        {course.university?.name || "-"}
      </p>
    </div>
    <div className="text-sm text-gray-700">
      Duration: <span className="font-semibold">{course.duration || "-"}</span>
    </div>
    <button
      className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
      onClick={() => onInquire(course)}
    >
      Inquire
    </button>
  </div>
);

export default CourseCard;
