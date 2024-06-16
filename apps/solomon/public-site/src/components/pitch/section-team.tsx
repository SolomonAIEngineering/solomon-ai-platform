import Image from "next/image";
import Link from "next/link";
import alexis from "./alexis.jpg";
import { Card } from "./ui";
import yoan from "./yoanyomba.jpeg";
import yvan from './yvan.jpg';
export function SectionTeam() {
  return (
    <div className="min-h-screen relative w-screen">
      <div className="absolute left-4 right-4 md:left-8 md:right-8 top-4 flex justify-between text-lg">
        <span>Who we are</span>
        <span className="text-[#878787]">
          <Link href="/">Solomon AI </Link>
        </span>
      </div>
      <div className="flex flex-col min-h-screen justify-center container p-[5%]">
        <div className="grid md:grid-cols-3 gap-8 px-4 md:px-0 md:pt-0 h-[580px] md:h-auto overflow-auto pb-[100px] md:pb-0">
          <div className="space-y-8">
            <Card className="items-start space-y-0 rounded-2xl">
              <Image
                src={yoan}
                alt="Yoan"
                width={76}
                height={76}
                quality={100}
                className="mb-4 rounded-full"
              />

              <h2 className="text-xl">Yoan Yomba</h2>
              <span>Co-founder</span>

              <p className="text-[#878787] text-sm !mt-2">
                Fullstack developer with 8 years of experience working at Microsoft, Goldman Sachs, JP Morgan, And Salesforce.
              </p>
            </Card>
            <Card className="items-start space-y-0 rounded-2xl">
              <Image
                src={alexis}
                alt="Alexis"
                width={76}
                height={76}
                quality={100}
                className="mb-4 rounded-full"
              />

              <h2 className="text-xl">Alexis Serra</h2>
              <span>Co-founder</span>

              <p className="text-[#878787] text-sm !mt-2">
                JD/MBA Candidate At University of Chicago with previous experience leading product at Goldman Sachs and Amazon (AWS).
              </p>
            </Card>

            <Card className="items-start space-y-0 rounded-2xl">
              <Image
                src={yvan}
                alt="Yvan"
                width={76}
                height={76}
                quality={100}
                className="mb-4 rounded-full"
              />

              <h2 className="text-xl">Yvan Yomba</h2>
              <span className="mb-4">Co-founder</span>

              <p className="text-[#878787] text-sm !mt-2">
                MD Candidate at Rutgers University with experience growing SMB's. Grew StreetReady LLC to 6000 customers in 2 years. <br />
              </p>
            </Card>
          </div>
          {/* <div>
            <Image
              src={founders}
              alt="Founders"
              width={650}
              height={875}
              quality={100}
            />
          </div> */}
          <div className="ml-auto w-full space-y-8 items-center flex">
            <h2 className="text-[64px] font-medium text-center leading-tight">
              “We've known and worked with one another for well over a decade”
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
