import Notifications from "../models/Notifications.model.js";

export const getNotifications=async (req, res, next) => {
  try {
    const notifications = await Notifications.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, data: notifications });
  } catch (err) {
    console.error('❌ Error fetching notifications:', err);
    next(err);
  }
}
export const markReadNotification=async(req, res, next) => {
  try {
    await Notifications.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error marking notification read:', err);
    next(err);
  }
}