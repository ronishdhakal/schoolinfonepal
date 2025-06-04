export const metadata = {
  title: "School Info Nepal",
  description: "Explore Schools, Colleges, Universities, and Admissions in Nepal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
