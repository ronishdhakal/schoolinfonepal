"use client";

const InformationTopDescription = ({ info }) => {
  if (!info.top_description) return null;
  return (
    <div className="prose max-w-none mb-8">
      <div dangerouslySetInnerHTML={{ __html: info.top_description }} />
    </div>
  );
};

export default InformationTopDescription;
