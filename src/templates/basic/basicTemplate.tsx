import type { FC } from 'react';

import type { ResumeTemplateData } from '~/templates';

export const BasicTemplate: FC<ResumeTemplateData> = (props) => {
  return (
    <div className="space-y-8">
      <div className="flex">
        <div className="flex flex-1 flex-col gap-2">
          <h1 className="text-3xl">
            {props.personalInformation.firstname} {props.personalInformation.lastname}
          </h1>
          <div className="grid grid-cols-[auto_1fr] gap-2">
            <p>Address</p>
            <p>
              {props.personalInformation.street} {props.personalInformation.postalCode}{' '}
              {props.personalInformation.city} {props.personalInformation.country}
            </p>
            {props.personalInformation.nationality ? (
              <>
                <p>Nationality</p>
                <p>{props.personalInformation.nationality}</p>
              </>
            ) : null}
            {props.personalInformation.email ? (
              <>
                <p>E-Mail</p>
                <a href={`mailto:${props.personalInformation.email}`}>
                  <p>{props.personalInformation.email}</p>
                </a>
              </>
            ) : null}
            {props.personalInformation.phone ? (
              <>
                <p>Phone</p>
                <a href={`tel:${props.personalInformation.phone}`}>
                  <p>{props.personalInformation.phone}</p>
                </a>
              </>
            ) : null}
            {props.personalInformation.webUrl ? (
              <>
                <p>Web</p>
                <a href={props.personalInformation.webUrl}>
                  <p>{props.personalInformation.webUrl}</p>
                </a>
              </>
            ) : null}
          </div>
        </div>
        {props.personalInformation.avatar ? (
          <img
            // TODO(fix): the url should be completed instead of just the base64 string
            src={'data:image/webp;base64,' + props.personalInformation.avatar}
            alt="avatar"
            className="h-32 w-32 rounded-full border border-solid border-neutral-400"
          />
        ) : null}
      </div>

      {props.personalInformation.description ? (
        <div className="flex flex-col gap-4">
          <h2 className="border-b-solid w-full border-b border-b-black text-center text-2xl">
            Profile
          </h2>
          <p>{props.personalInformation.description}</p>
        </div>
      ) : null}

      {props.workExperience ? (
        <>
          <h2 className="border-b-solid w-full border-b border-b-black text-center text-2xl">
            Work Experience
          </h2>
          {props.workExperience.map((workExperience, idx) => {
            return (
              <div
                key={`work-experience-${idx}`}
                className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-4"
              >
                <div className="flex flex-col">
                  <span>
                    {workExperience.from} - {workExperience.to}
                  </span>
                  <span>
                    {workExperience.city}, {workExperience.country}
                  </span>
                </div>
                <div>
                  <p className="font-bold">{workExperience.company}</p>
                  <p className="font-bold">{workExperience.title}</p>
                </div>
                <p className="col-start-2">{workExperience.description}</p>
              </div>
            );
          })}
        </>
      ) : null}
    </div>
  );
};
