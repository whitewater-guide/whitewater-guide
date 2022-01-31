class MatrixClient {
  public async loginAsApi() {
    await Promise.resolve();
  }

  public async createRoom(): Promise<{ room_id: string }> {
    return Promise.resolve({ room_id: '!__new_room_id__:whitewater.guide' });
  }

  public async logout() {
    await Promise.resolve();
  }
}

export const matrixClient = new MatrixClient();
