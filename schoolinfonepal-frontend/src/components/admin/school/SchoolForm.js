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

// Utility: Extract metadata and collect files for nested arrays
function processGallery(gallery) {
  const metadata = [];
  const files = {};
  (gallery || []).forEach((item, i) => {
    // If new upload, item.image is a File. If already uploaded, it's a URL.
    if (item.image instanceof File) {
      files[`gallery_${i}_image`] = item.image;
      // Only store filename in metadata if you want, or leave empty for backend to assign
      metadata.push({ caption: item.caption || "" });
    } else {
      metadata.push({ image: item.image, caption: item.caption || "" });
    }
  });
  return { metadata, files };
}

// Utility: Extract metadata and collect file for message image
function processMessages(messages) {
  if (!messages || !messages.length) return { metadata: [], files: {} };
  const files = {};
  let item = messages[0];
  let meta = { ...item };
  if (item.image instanceof File) {
    files["messages_0_image"] = item.image;
    meta.image = ""; // let backend assign uploaded image
  }
  // Otherwise, image is already string (URL), so keep as is
  return { metadata: [meta], files };
}

const SchoolForm = ({ slug = null, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(!!slug);
  const router = useRouter();

  useEffect(() => {
    if (slug) {
      fetchSchoolBySlug(slug)
        .then((data) => {
          // Defensive: always set blank arrays if missing
          setFormData({
            ...data,
            phones: data.phones || [],
            emails: data.emails || [],
            gallery: data.gallery || [],
            brochures: data.brochures || [],
            social_media: data.social_media || [],
            faqs: data.faqs || [],
            messages: data.messages || [],
            school_courses: data.school_courses || [],
            facilities: data.facilities || [],
            universities: data.universities || [],
          });
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

    // Flat fields (text, boolean, date, etc.)
    const flatFields = [
      "name", "slug", "address", "map_link", "website",
      "established_date", "type", "district", "level",
      "level_text", "verification", "featured", "priority",
      "salient_feature", "scholarship", "about_college"
    ];
    flatFields.forEach((key) => {
      if (formData[key] !== undefined && formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    // Logo & Cover Photo
    if (formData.logo instanceof File) {
      data.append("logo", formData.logo);
    }
    if (formData.cover_photo instanceof File) {
      data.append("cover_photo", formData.cover_photo);
    }

    // --- Nested arrays with file handling ---
    // Gallery
    const { metadata: galleryMeta, files: galleryFiles } = processGallery(formData.gallery);
    data.append("gallery", JSON.stringify(galleryMeta));
    Object.entries(galleryFiles).forEach(([key, file]) => {
      data.append(key, file);
    });

    // Brochures (if you want to allow file upload for brochures, process similar to gallery)
    // For simplicity, assume brochures only contains {file, description} with file being a File or URL.
    const brochuresMeta = (formData.brochures || []).map((item, i) => {
      // If brochure file is a File, upload separately and leave empty string here.
      if (item.file instanceof File) {
        data.append(`brochures_${i}_file`, item.file);
        return { description: item.description || "" };
      } else {
        return { file: item.file, description: item.description || "" };
      }
    });
    data.append("brochures", JSON.stringify(brochuresMeta));

    // Messages
    const { metadata: messagesMeta, files: messagesFiles } = processMessages(formData.messages);
    data.append("messages", JSON.stringify(messagesMeta));
    Object.entries(messagesFiles).forEach(([key, file]) => {
      data.append(key, file);
    });

    // Phones/Emails/Social Media/FAQs (just JSON)
    data.append("phones", JSON.stringify(formData.phones || []));
    data.append("emails", JSON.stringify(formData.emails || []));
    data.append("social_media", JSON.stringify(formData.social_media || []));
    data.append("faqs", JSON.stringify(formData.faqs || []));
    // School Courses (must use school_courses everywhere!)
    data.append("school_courses", JSON.stringify(formData.school_courses || []));

    // M2M: Send each PK as required by backend
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
      <SchoolCourses
        formData={formData}
        setFormData={setFormData}
        fieldKey="school_courses"
      />
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
