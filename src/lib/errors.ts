import { UrinatorBuildErrorCodes } from './types'

const PATH_BUILD_ERROR_CODE = 0
const TEMPLATE_PATH_BUILD_ERROR_CODE = 1
const FILL_BUILD_ERROR_CODE = 2
const FILL_NON_EXISTENT_TEMPLATE_ERROR_CODE = 3

export const URINATOR_BUILD_ERROR_CODES: UrinatorBuildErrorCodes = Object.freeze({
  PATH_BUILD_ERROR_CODE,
  TEMPLATE_PATH_BUILD_ERROR_CODE,
  FILL_BUILD_ERROR_CODE,
  FILL_NON_EXISTENT_TEMPLATE_ERROR_CODE,
})

export class UrinatorBuildError extends Error {
  public message: string;
  public code: number;

  constructor(
    message: string = 'UrinatorBuildError',
    code: number
  ) {

    super(message)

    this.message = `${message} - ${code}`
    this.code = code
    Object.setPrototypeOf(this, UrinatorBuildError.prototype)
  }

  static path(): UrinatorBuildError {
    return new UrinatorBuildError(
      'You cannot build path when `template` is also used.',
      URINATOR_BUILD_ERROR_CODES.PATH_BUILD_ERROR_CODE
    )
  }

  static templatePath(): UrinatorBuildError {
    return new UrinatorBuildError(
      'You cannot build template path when `paths` are also used.',
      URINATOR_BUILD_ERROR_CODES.TEMPLATE_PATH_BUILD_ERROR_CODE
    )
  }

  static fill(): UrinatorBuildError {
    return new UrinatorBuildError(
      'You cannot fill template value without `template` present.',
      URINATOR_BUILD_ERROR_CODES.FILL_BUILD_ERROR_CODE
    )
  }

  static fillValue(key: string): UrinatorBuildError {
    return new UrinatorBuildError(
      `Unable to fill value within template. ${key} does not exist in template.`,
      URINATOR_BUILD_ERROR_CODES.FILL_NON_EXISTENT_TEMPLATE_ERROR_CODE
    )
  }
}
