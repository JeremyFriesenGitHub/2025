/* import process from 'node:process' */
import { Body, Container, Img, Section, Tailwind } from '@react-email/components'

/* const baseUrl = process.env.ASSET_URL || 'http://localhost:3000' */
/* const baseUrl = process.env.CUHACKING_2025_EMAIL_TEMPLATES_SITE_LOCAL_URL */

export function Banner() {
  return (
    <Tailwind>
      <Body className="m-0 p-0 bg-black">
        <Container
          // className="w-full max-w-[600px] h-[192px] bg-[url('/static/bg-keycap-2.webp')] bg-cover bg-center text-white font-mono text-center"
          className="w-full max-w-[600px] h-[192px] bg-[url('https://rtmsxedfqcyusebbrull.supabase.co/storage/v1/object/sign/cuhacking/media/bg-keycap-2.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjdWhhY2tpbmcvbWVkaWEvYmcta2V5Y2FwLTIud2VicCIsImlhdCI6MTc0MDkxMjI5MCwiZXhwIjoxNzcyNDQ4MjkwfQ.S1oQiR--_NtIsXl5NPF_6oFY2VK-SIMO36LT7N5WwmM')] bg-cover bg-center text-white font-mono text-center"
        >
          <Section>
            <table className="w-full">
              <tr>
                <td className="py-0 pb-0">
                  <h3 className="text-2xl leading-tight m-0">We hope to</h3>
                </td>
              </tr>
              <tr>
                <td className="text-center mt-[-8px]">
                  <table className="mx-auto">
                    <tr>
                      <td className="pr-2 align-middle">
                        <Img
                          src="https://rtmsxedfqcyusebbrull.supabase.co/storage/v1/object/sign/cuhacking/media/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjdWhhY2tpbmcvbWVkaWEvbG9nby5wbmciLCJpYXQiOjE3NDA5MTA0MDQsImV4cCI6MTc3MjQ0NjQwNH0.47yIX2M5pymmFW1aX1FxRHzs4hnBxhQj20iphG4j-pg"
                          // src={`${baseUrl}/static/logo.png`}
                          alt="cuHacking Logo"
                          width="60"
                          className="block"
                        />
                      </td>
                      <td className="align-middle">
                        <h1 className="text-4xl m-0">cuHacking</h1>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

          </Section>
        </Container>
      </Body>
    </Tailwind>
  )
}
