"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import {
  createSchool,
  updateSchool,
  fetchSchoolBySlug,
} from "@/utils/api";

import SchoolHeader from "./SchoolHeader";
import SchoolContact from "./SchoolContact";
import SchoolAbout from "./SchoolAbout";
import SchoolGallery from "./SchoolGallery";
import SchoolBrochure from "./SchoolBrochure";
import SchoolSocialMedia from "./SchoolSocialMedia";
import SchoolFAQ from "./SchoolFAQ";
import SchoolMessage from "./SchoolMessage";
import SchoolCourses from "./SchoolCourses";
import SchoolFacilities from "./SchoolFacilities";
import SchoolUniversity from "./SchoolUniversity";
import SchoolLevel from "./SchoolLevel";

const SchoolForm = ({ slug = null, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(!!slug);
  const router = useRouter();

  useEffect(() => {
    if (slug) {
      fetchSchoolBySlug(slug)
        .then((data) => {
          setFormData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load school:", err);
        });
    }
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Flat fields
    const flatFields = [
      "name", "slug", "address", "map_link", "website",
      "established_date", "type", "district", "level",
      "level_text", "verification", "featured", "priority"
    ];
    flatFields.forEach((key) => {
      if (formData[key] !== undefined && formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    // Images
    if (formData.logo instanceof File) {
      data.append("logo", formData.logo);
    }
    if (formData.cover_photo instanceof File) {
      data.append("cover_photo", formData.cover_photo);
    }

    // Phones
    (formData.phones || []).forEach((item, i) => {
      if (item.phone) {
        data.append(`phones[${i}][phone]`, item.phone);
      }
    });

    // Emails
    (formData.emails || []).forEach((item, i) => {
      if (item.email) {
        data.append(`emails[${i}][email]`, item.email);
      }
    });

    // Gallery
    (formData.gallery || []).forEach((item, i) => {
      if (item.image instanceof File) {
        data.append(`gallery[${i}][image]`, item.image);
      }
      if (item.caption) {
        data.append(`gallery[${i}][caption]`, item.caption);
      }
    });

    // Brochures
    (formData.brochures || []).forEach((item, i) => {
      if (item.file instanceof File) {
        data.append(`brochures[${i}][file]`, item.file);
      }
      if (item.description) {
        data.append(`brochures[${i}][description]`, item.description);
      }
    });

    // Social Media
    (formData.social_media || []).forEach((item, i) => {
      if (item.platform && item.url) {
        data.append(`social_media[${i}][platform]`, item.platform);
        data.append(`social_media[${i}][url]`, item.url);
      }
    });

    // FAQs
    (formData.faqs || []).forEach((item, i) => {
      if (item.question && item.answer) {
        data.append(`faqs[${i}][question]`, item.question);
        data.append(`faqs[${i}][answer]`, item.answer);
      }
    });

    // Message
    const msg = formData.messages?.[0];
    if (msg) {
      if (msg.title) data.append("messages[0][title]", msg.title);
      if (msg.message) data.append("messages[0][message]", msg.message);
      if (msg.name) data.append("messages[0][name]", msg.name);
      if (msg.designation) data.append("messages[0][designation]", msg.designation);
      if (msg.image instanceof File) {
        data.append("messages[0][image]", msg.image);
      }
    }

    // Courses
    (formData.courses || []).forEach((item, i) => {
      if (item.course) {
        data.append(`courses[${i}][course]`, item.course);
        if (item.fee) data.append(`courses[${i}][fee]`, item.fee);
        if (item.status) data.append(`courses[${i}][status]`, item.status);
      }
    });

    // Facilities and Universities (IDs)
    (formData.facilities || []).forEach((id) => data.append("facilities", id));
    (formData.universities || []).forEach((id) => data.append("universities", id));

    try {
      if (slug) {
        await updateSchool(slug, data);
      } else {
        await createSchool(data);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/schools");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Submission failed. See console.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <SchoolHeader formData={formData} setFormData={setFormData} />
      <SchoolContact formData={formData} setFormData={setFormData} />
      <SchoolAbout formData={formData} setFormData={setFormData} />
      <SchoolGallery formData={formData} setFormData={setFormData} />
      <SchoolBrochure formData={formData} setFormData={setFormData} />
      <SchoolSocialMedia formData={formData} setFormData={setFormData} />
      <SchoolFAQ formData={formData} setFormData={setFormData} />
      <SchoolMessage formData={formData} setFormData={setFormData} />
      <SchoolCourses formData={formData} setFormData={setFormData} />
      <SchoolFacilities formData={formData} setFormData={setFormData} />
      <SchoolUniversity formData={formData} setFormData={setFormData} />
      <SchoolLevel formData={formData} setFormData={setFormData} />

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        {slug ? "Update School" : "Create School"}
      </button>
    </form>
  );
};

export default SchoolForm;
