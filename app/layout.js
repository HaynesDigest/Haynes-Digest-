export const metadata = {
  title: 'Weekly Digest',
  description: 'Share cool links with your friends',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'sans-serif', maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem' }}>
        {children}
      </body>
    </html>
  )
}

