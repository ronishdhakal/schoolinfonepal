"use client";

const InformationContent = ({ info }) => {
  if (!info.content) return null;
  return (
    <div className="prose max-w-none mb-8">
      <div dangerouslySetInnerHTML={{ __html: info.content }} />
    </div>
  );
};

export default InformationContent;
