/////////// IMPORTS
import { BiShowAlt } from "react-icons/bi"
import { IoMdAdd } from "react-icons/io"
import { Button } from "../../atoms"
import { t } from "i18next"
///
//import classes from './SystemCard.module.css'
///
/////////// Types

///
type SystemCardProps_TP = {
  addHandler: () => void
  viewHandler?: () => void
  addLabel?: string
  viewLabel?: string
  title: string
  forStyle?: boolean
  viewCountReyal?:number
  viewCountGram?:number
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const SystemCard = ({
  addHandler,
  viewHandler,
  addLabel,
  viewLabel,
  title,
  forStyle,
  viewCountReyal,
  viewCountGram
}: SystemCardProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///

  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// IF CASES
  ///

  ///
  /////////// FUNCTIONS & EVENTS
  ///

  ///
  return (
    <div className="col-span-1 w-full rounded-md p-3 shadow-xl ">
      <div className="grid grid-rows-view gap-4">
        <div
          className={`flex w-full items-center justify-center gap-2  rounded-lg  py-2 px-4 text-white ${
            forStyle ? "flex-col bg-mainGreen" : "bg-mainOrange"
          }`}
        >
          <div className="flex w-full items-center justify-center">
            <h3>{title}</h3>
          </div>
        </div>
        {addLabel && addHandler && (
          <Button bordered={true} action={addHandler} className="border-[0.7px] px-2 ">
            <div className="flex justify-center items-center">
              <IoMdAdd className="fill-lightBlack" fill="lightBlack" size={22} />
              <p className="text-sm ms-1">{addLabel}</p>
            </div>
          </Button>
        )}

        {/* {viewCountReyal && (
            <div className="flex justify-center items-center border-[0.8px] p-2 border-mainGreen text-mainGreen rounded-md font-bold">
              <p className="text-sm ms-1">{viewCountReyal}</p>
            </div>
        )} */}

        {viewCountGram && (
            <div className="text-center border-[0.8px] p-2 border-mainGreen text-mainGreen rounded-md font-bold">
              <p className="font-bold ms-1 mb-4">{t("Branch current")}</p>
              <div className="flex justify-between items-center px-4 ">
                <p>{viewCountReyal}</p>
                <p>{viewCountGram}</p>
              </div>
            </div>
        )}

        {viewLabel && (
          <Button
            bordered={true}
            className={`
              px-2
              border-[0.7px]
              forStyle
                ? "!bg-green !bg-opacity-20	 !text-mainGreen"
                : "!bg-mainOrange !bg-opacity-20"
            `}
            action={viewHandler}
          >
            <div className="flex justify-center items-center">
              <BiShowAlt size={22} />
              <p className="text-sm ms-1">{viewLabel}</p>
            </div>
          </Button>
        )}
      </div>
    </div>
  )
}
