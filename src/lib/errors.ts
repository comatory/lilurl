import { LilurlBuildErrorCodes } from './types'

const PATH_BUILD_ERROR_CODE = 0
const TEMPLATE_PATH_BUILD_ERROR_CODE = 1
const FILL_BUILD_ERROR_CODE = 2
const FILL_NON_EXISTENT_TEMPLATE_ERROR_CODE = 3

export const LILURL_BUILD_ERROR_CODES: LilurlBuildErrorCodes = Object.freeze({
  PATH_BUILD_ERROR_CODE,
  TEMPLATE_PATH_BUILD_ERROR_CODE,
  FILL_BUILD_ERROR_CODE,
  FILL_NON_EXISTENT_TEMPLATE_ERROR_CODE,
})

export class LilurlBuildError extends Error {
  public message: string;
  public code: number;

  constructor(
    message: string = 'LilurlBuildError',
    code: number
  ) {

    super(message)

    this.message = `${message} - ${code}`
    this.code = code
    Object.setPrototypeOf(this, LilurlBuildError.prototype)
  }

  static path(): LilurlBuildError {
    return new LilurlBuildError(
      'You cannot build path when `template` is also used.',
      LILURL_BUILD_ERROR_CODES.PATH_BUILD_ERROR_CODE
    )
  }

  static templatePath(): LilurlBuildError {
    return new LilurlBuildError(
      'You cannot build template path when `paths` are also used.',
      LILURL_BUILD_ERROR_CODES.TEMPLATE_PATH_BUILD_ERROR_CODE
    )
  }

  static fill(): LilurlBuildError {
    return new LilurlBuildError(
      'You cannot fill template value without `template` present.',
      LILURL_BUILD_ERROR_CODES.FILL_BUILD_ERROR_CODE
    )
  }

  static fillValue(key: string): LilurlBuildError {
    return new LilurlBuildError(
      `Unable to fill value within template. ${key} does not exist in template.`,
      LILURL_BUILD_ERROR_CODES.FILL_NON_EXISTENT_TEMPLATE_ERROR_CODE
    )
  }
}
