private Rigidbody rb;

// Start 方法在游戏开始时调用
void Start()
{
    // 获取球的刚体组件
    rb = GetComponent<Rigidbody>();
    
    // 设置初始速度为 (1, 0, 1) 的方向，并乘以 20 的速度
    rb.velocity = (new Vector3(1, 0, 1)) * 20;
}

public float moveSpeed = 5.0f;

void Update()
{
    // 如果按下 W 键，球向前移动
    if (Input.GetKey(KeyCode.W))
    {
        // 使用 Translate 方法根据移动速度和时间移动球
        transform.Translate(Vector3.forward * moveSpeed * Time.deltaTime);
    }

    // 如果按下 S 键，球向后移动
    if (Input.GetKey(KeyCode.S))
    {
        // 使用 Translate 方法根据移动速度和时间移动球
        transform.Translate(Vector3.back * moveSpeed * Time.deltaTime);
    }
}
