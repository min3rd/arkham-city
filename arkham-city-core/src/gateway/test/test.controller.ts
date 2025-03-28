import { Controller, Get, Res } from "@nestjs/common";

@Controller("test")
export class TestController {
  @Get()
  test(@Res() res: any) {
    setTimeout(() => {
      res.send("Hello world");
    }, 3000);
  }
}
